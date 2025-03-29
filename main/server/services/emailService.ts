import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

import type { DBEmailFeedback } from "~lib/types/email";
import { DatabaseService } from "~~/server/services/databaseService";

type DBEmailFeedbackRequest = Omit<DBEmailFeedback, 'feedback_id'>;

type EmailParams = {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    from: string | { name: string; address: string };
    highPriority?: boolean;
}

// New type for invitation parameters with profile image
type InviteParams = {
    email: string;
    inviteToken: string;
    inviteeName: string;
    profileImageUrl?: string;
}

export class EmailService {
    private static instance: EmailService | null = null;
    private isProcessing: boolean = false;
    private sesClient: SESClient | undefined = undefined;
    private sqsClient: SQSClient | undefined = undefined;
    // Service lifecycle tracking
    private lastActivityTimestamp: number = Date.now();

    private constructor() {
        const config = useRuntimeConfig();
        try {
            this.sesClient = new SESClient({
                region: config.aws.region,
                credentials: {
                    accessKeyId: config.aws.ses.accessKeyId!,
                    secretAccessKey: config.aws.ses.secretAccessKey!
                }
            });

            this.sqsClient = new SQSClient({
                region: config.aws.region,
                credentials: {
                    accessKeyId: config.aws.sqs.accessKeyId!,
                    secretAccessKey: config.aws.sqs.secretAccessKey!
                }
            });

            // Only start processing in the constructor - we want this to run for the entire app lifecycle
            this.startProcessing().catch((error: any) => {
                console.error('Failed to start email processing:', error);
            });
        }
        catch (error) {
            console.error('Failed to initialize EmailService:', error);
        }
    }

    public static getInstance(): EmailService {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }

    // Get the time since last activity in milliseconds
    public getIdleTime(): number {
        return Date.now() - this.lastActivityTimestamp;
    }

    private updateActivity(): void {
        this.lastActivityTimestamp = Date.now();
    }

    public async sendEmail({
        to,
        subject,
        text,
        html,
        from,
        highPriority = false,
    }: EmailParams): Promise<string> {
        this.updateActivity();

        const config = useRuntimeConfig();
        const recipients = Array.isArray(to) ? to : [to];

        if (!from) {
            throw new Error('No from email address specified and no default from email configured');
        }

        for (const recipient of recipients) {
            const hasRecentBounce = await this.checkRecentBounces(recipient);
            if (hasRecentBounce) {
                throw new Error(`Cannot send email to ${recipient} due to recent bounce`);
            }
        }

        const sourceEmail = typeof from === 'string'
            ? from
            : `${from.name} <${from.address}>`;

        const command = new SendEmailCommand({
            Source: sourceEmail,
            Destination: {
                ToAddresses: recipients,
            },
            Message: {
                Subject: {
                    Data: subject,
                    Charset: 'UTF-8',
                },
                Body: {
                    ...(text && {
                        Text: {
                            Data: text,
                            Charset: 'UTF-8',
                        },
                    }),
                    ...(html && {
                        Html: {
                            Data: html,
                            Charset: 'UTF-8',
                        },
                    }),
                },
            },
            ...(highPriority && {
                Headers: [
                    {
                        Name: 'X-Priority',
                        Value: '1'
                    },
                    {
                        Name: 'Importance',
                        Value: 'high'
                    },
                    {
                        Name: 'X-MSMail-Priority',
                        Value: 'High'
                    }
                ]
            })
        });

        try {
            if (!this.sesClient) {
                throw new Error('SES client not initialized');
            }

            const response = await this.sesClient.send(command);
            return response?.MessageId || '';
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    public getInvitationEmailTemplate(content: string, buttonText: string, registrationUrl: string): string {
        const config = useRuntimeConfig();
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light dark">
            <meta name="supported-color-schemes" content="light dark">
            <style>
                @media (prefers-color-scheme: dark) {
                    .body-dark {
                        background-color: #121212 !important;
                    }
                    .content-dark {
                        background-color: #171717 !important;
                    }
                    .text-dark {
                        color: #f0f0f0 !important;
                    }
                    .text-secondary-dark {
                        color: #a2a2a2 !important;
                    }
                    .border-dark {
                        border-color: #333333 !important;
                    }
                    .button-dark {
                        background-color: rgb(73, 139, 225) !important;
                        color: #d7e3ff !important;
                    }
                    .link-dark {
                        color: rgb(73, 139, 225) !important;
                    }
                }
            </style>
        </head>
        <body class="body-dark" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #171717; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9f9f9;">
            <div class="content-dark" style="padding: 40px 24px; background-color: #ffffff; border-radius: 8px; margin: 20px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                <div style="text-align: center; margin-bottom: 32px;">
                    <!-- Logo placeholder - Replace with your actual logo -->
                    <h1 class="text-dark" style="color: #000000; margin: 0; font-size: 28px; font-weight: 800;">Pain Coach</h1>
                </div>
                
                <div style="text-align: center; margin-bottom: 30px;">
                    ${content}
                </div>
                
                <div style="text-align: center; margin-bottom: 36px;">
                    <a href="${registrationUrl}" class="button-dark" style="display: inline-block; 
                       padding: 14px 32px; 
                       background-color: #000000; 
                       color: #ffffff;
                       font-weight: 600;
                       text-decoration: none; 
                       border-radius: 6px;
                       font-size: 16px;
                       transition: all 0.2s ease;">
                        ${buttonText}
                    </a>
                </div>
                
                <div class="border-dark" style="border-top: 1px solid #e0e0e0; margin: 36px 0; padding-top: 24px;">
                    <p class="text-secondary-dark" style="color: #333333; font-size: 14px; margin-bottom: 16px;">
                        If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="text-align: center;">
                        <a href="${registrationUrl}" class="link-dark" style="color: #000000; word-break: break-all; font-size: 14px; text-decoration: none;">${registrationUrl}</a>
                    </p>
                </div>
                
                <div style="margin-top: 40px; text-align: center;">
                    <p class="text-secondary-dark" style="color: #a2a2a2; font-size: 13px; margin: 8px 0;">
                        If you didn't expect this invitation, you can safely ignore this email.
                    </p>
                    <p class="text-secondary-dark" style="color: #a2a2a2; font-size: 13px; margin: 8px 0;">
                        © ${new Date().getFullYear()} Pain Coach. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
    }

    // Bounce and complaint handling
    private async startProcessing(): Promise<void> {
        if (this.isProcessing) return;
        this.isProcessing = true;

        const config = useRuntimeConfig();
        const queueUrl = `https://sqs.${config.aws.region}.amazonaws.com/${config.aws.accountId}/${config.aws.sqs.queueName}`;

        while (this.isProcessing) {
            try {
                const command = new ReceiveMessageCommand({
                    QueueUrl: queueUrl,
                    MaxNumberOfMessages: 10,
                    WaitTimeSeconds: 20
                });

                if (!this.sqsClient) {
                    throw new Error('SQS client not initialized');
                }

                const response = await this.sqsClient.send(command);

                if (response?.Messages) {
                    this.updateActivity();

                    for (const message of response.Messages) {
                        try {
                            const notificationData = JSON.parse(message.Body!);
                            const snsMessage = JSON.parse(notificationData.Message);

                            switch (snsMessage.notificationType) {
                                case 'Bounce':
                                    const bounceInfo = snsMessage.bounce;
                                    for (const recipient of bounceInfo.bouncedRecipients) {
                                        await this.recordFeedback({
                                            email: recipient.emailAddress,
                                            feedback_type: 'bounce',
                                            sub_type: bounceInfo.bounceType,
                                            timestamp: new Date(bounceInfo.timestamp),
                                            diagnostic: recipient.diagnosticCode,
                                        });
                                    }
                                    break;

                                case 'Complaint':
                                    const complaintInfo = snsMessage.complaint;
                                    for (const recipient of complaintInfo.complainedRecipients) {
                                        await this.recordFeedback({
                                            email: recipient.emailAddress,
                                            feedback_type: 'complaint',
                                            sub_type: complaintInfo.complaintFeedbackType || 'unknown',
                                            timestamp: new Date(complaintInfo.timestamp),
                                            diagnostic: complaintInfo.feedbackId,
                                        });
                                    }
                                    break;
                            }

                            if (!this.sqsClient) {
                                throw new Error('SQS client not initialized');
                            }

                            await this.sqsClient.send(new DeleteMessageCommand({
                                QueueUrl: queueUrl,
                                ReceiptHandle: message.ReceiptHandle
                            }));
                        }
                        catch (error) {
                            console.error('Error processing feedback message:', error);
                        }
                    }
                }

                if (response?.Messages && response.Messages.length !== 0) {
                    console.log(`EmailProcessor: Processed ${response.Messages.length} messages`);
                }

                await new Promise(resolve => setTimeout(resolve, 1 * 60 * 1000));
            }
            catch (error) {
                console.error('Error fetching SQS messages:', error);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }

    private async checkRecentBounces(email: string): Promise<boolean> {
        const transaction = await DatabaseService.getInstance().createTransaction();
        try {
            // First check if there's a bounce record at all
            const result = await transaction.query(
                `SELECT last_email_bounced_date 
                 FROM private.user 
                 WHERE email = $1`,
                [email]
            );

            await transaction.commit();

            if (result.length === 0 || result[0].last_email_bounced_date === null) {
                return false;
            }

            const lastBounceDate = result[0].last_bounce_date;
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            if (lastBounceDate < oneWeekAgo) {
                return false;
            }

            return true;
        }
        catch (error) {
            await transaction.rollback();
            console.error('Error checking recent bounces:', error);
            throw error;
        }
    }

    async recordFeedback(feedback: DBEmailFeedbackRequest): Promise<void> {
        const transaction = await DatabaseService.getInstance().createTransaction();

        try {
            await transaction.query(
                `INSERT INTO private.email_feedback 
                    (email, feedback_type, sub_type, timestamp, diagnostic)
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                    feedback.email,
                    feedback.feedback_type,
                    feedback.sub_type,
                    feedback.timestamp,
                    feedback.diagnostic,
                ]
            );

            if (feedback.feedback_type === 'bounce') {
                await transaction.query(
                    `UPDATE private.user 
                    SET last_email_bounced_date = CURRENT_TIMESTAMP, 
                        updated_at = CURRENT_TIMESTAMP
                    WHERE email = $1`,
                    [feedback.email, feedback.timestamp]
                );
            }

            await transaction.commit();
        }
        catch (error: any) {
            await transaction.rollback();

            if (error.code === '23503') {
                console.log(`EmailProcessor: Skipping feedback - Email not in system: ${feedback.email}`);
                return;
            }

            console.error('EmailProcessor: Error recording feedback:', error);
            throw error;
        }
    }

    public async shutdown(): Promise<void> {
        if (!this.isProcessing) return;

        this.isProcessing = false;
        console.log('EmailService: Shutdown SQS processing');
    }

    // For monitoring or health checks
    public isActive(): boolean {
        return this.isProcessing;
    }
}