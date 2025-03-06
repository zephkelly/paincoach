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
    highPriority?: boolean;  // New optional parameter
}


const config = useRuntimeConfig()
const ENVIRONMENT_DOMAIN = config.environmentDomain;
const NOREPLY_EMAIL = config.aws.ses.noreply;

const queueUrl = `https://sqs.${config.aws.region}.amazonaws.com/${config.aws.accountId}/${config.aws.sqs.queueName}`;


export class EmailService {
    private isProcessing: boolean = false;
    private sesClient: SESClient | undefined = undefined;
    private sqsClient: SQSClient | undefined = undefined;

    constructor() {
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

            this.startProcessing().catch((error: any) => {
                console.error('Failed to start email processing:', error);
            });
        }
        catch (error) {
            console.error('Failed to initialize EmailProcessor:', error);
        }
    }

    public async sendEmail({
        to,
        subject,
        text,
        html,
        from,
        highPriority = false,  // Default to false
    }: EmailParams): Promise<string> {
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
            // Conditionally add headers for importance
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

    public async sendVerificationEmail(email: string, token: string): Promise<string> {
        const verificationUrl = `${ENVIRONMENT_DOMAIN}/verify/e/${token}`;

        return this.sendEmail({
            to: email,
            subject: 'Verify your Advertiboard account',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
                    <div style="text-align: left;">
                        <h1 style="color: #4e9a4e; margin-bottom: 14px; font-size: 24px; font-weight: 800;">Welcome to Advertiboard</h1>
                        
                        <p style="color: #444; margin-bottom: 30px;">
                            Please verify your email address to get started:
                        </p>
                        
                        <a href="${verificationUrl}" 
                        style="display: inline-block; 
                                padding: 12px 28px; 
                                background-color: #3d8f47; 
                                color: #f3f3f3;
                                font-weight: 600;
                                text-decoration: none; 
                                border-radius: 4px;
                                font-size: 15px;">
                            Verify Email
                        </a>
                        
                        <p style="color: #666; font-size: 13px; margin-top: 52px;">
                            If the button doesn't work, copy this link:
                            <br>
                            <a href="${verificationUrl}" style="color:rgb(51, 125, 60); word-break: break-all; text-decoration: none;">${verificationUrl}</a>
                        </p>
                        
                        <div style="margin-top: 40px; font-size: 13px; color: #666;">
                            © ${new Date().getFullYear()} Advertiboard
                        </div>
                    </div>
                </body>
            </html>`,
            from: {
                name: 'Advertiboard',
                address: NOREPLY_EMAIL
            },
            highPriority: true
        });
    }

    public async sendVerificationSuccessEmail(email: string): Promise<string> {
        return this.sendEmail({
            to: email,
            subject: 'Email Verified - Welcome to Advertiboard',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
                    <div style="text-align: left;">
                        <h1 style="color: #2c7634; margin-bottom: 14px; font-size: 24px; font-weight: 800;">Email Verified Successfully</h1>
                       
                        <p style="color: #444; margin-bottom: 30px;">
                            Thank you for verifying your email address. Your Advertiboard account is now ready to use.
                        </p>
                       
                        <a href="${ENVIRONMENT_DOMAIN}/"
                        style="display: inline-block;
                                padding: 12px 28px;
                                background-color: #2c7634;
                                color: #f3f3f3;
                                font-weight: 600;
                                text-decoration: none;
                                border-radius: 4px;
                                font-size: 15px;">
                            Create Your First Ad
                        </a>
                       
                        <p style="color: #444; margin-top: 30px;">
                            If you have any questions, feel free to reach out to our support team.
                        </p>
                       
                        <div style="margin-top: 40px; font-size: 13px; color: #666;">
                            © ${new Date().getFullYear()} Advertiboard
                        </div>
                    </div>
                </body>
                </html>
            `,
            from: {
                name: 'Advertiboard',
                address: NOREPLY_EMAIL
            },
            highPriority: true
        });
    }

    public async sendPasswordResetEmail(email: string, token: string): Promise<string> {
        const resetUrl = `${ENVIRONMENT_DOMAIN}/reset/p/${token}`;
        return this.sendEmail({
            to: email,
            subject: 'Reset Your Password',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
                    <div style="text-align: left;">
                        <h1 style="color: #4e9a4e; margin-bottom: 14px; font-size: 24px; font-weight: 800;">Reset Your Password</h1>
                       
                        <p style="color: #444; margin-bottom: 30px;">
                            We received a request to reset your password. Click the button below to create a new password:
                        </p>
                       
                        <a href="${resetUrl}"
                        style="display: inline-block;
                                padding: 12px 28px;
                                background-color: #2c7634;
                                color: #f3f3f3;
                                font-weight: 600;
                                text-decoration: none;
                                border-radius: 4px;
                                font-size: 15px;">
                            Reset Password
                        </a>
                       
                        <p style="color: #666; font-size: 13px; margin-top: 52px;">
                            If the button doesn't work, copy this link:
                            <br>
                            <a href="${resetUrl}" style="color:#2c7634; word-break: break-all; text-decoration: none;">${resetUrl}</a>
                        </p>
                        
                        <p style="color: #444; margin-top: 30px; font-size: 13px;">
                            For security, this link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
                        </p>
                       
                        <div style="margin-top: 40px; font-size: 13px; color: #666;">
                            © ${new Date().getFullYear()} Advertiboard
                        </div>
                    </div>
                </body>
                </html>
            `,
            from: {
                name: 'Advertiboard',
                address: NOREPLY_EMAIL
            },
            highPriority: true
        });
    }

    public async sendPasswordResetConfirmationEmail(email: string): Promise<string> {
        return this.sendEmail({
            to: email,
            subject: 'Your Password Has Been Reset',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
                    <div style="text-align: left;">
                        <h1 style="color: #2c7634; margin-bottom: 14px; font-size: 24px; font-weight: 800;">Password Reset Complete</h1>
                       
                        <p style="color: #444; margin-bottom: 30px;">
                            Your Advertiboard password has been successfully reset. You can now sign in with your new password.
                        </p>
                       
                        <a href="${ENVIRONMENT_DOMAIN}/"
                        style="display: inline-block;
                                padding: 12px 28px;
                                background-color:#2c7634;
                                color: #f3f3f3;
                                font-weight: 600;
                                text-decoration: none;
                                border-radius: 4px;
                                font-size: 15px;">
                            Sign In
                        </a>
                       
                        <p style="color: #444; margin-top: 30px; font-size: 13px;">
                            If you did not reset your password, please contact our support team immediately as your account may have been compromised.
                        </p>
                       
                        <div style="margin-top: 40px; font-size: 13px; color: #666;">
                            © ${new Date().getFullYear()} Advertiboard
                        </div>
                    </div>
                </body>
                </html>
            `,
            from: {
                name: 'Advertiboard',
                address: NOREPLY_EMAIL
            },
            highPriority: true
        });
    }


    // Bounce and complaint handling
    private async startProcessing(): Promise<void> {
        if (this.isProcessing) return;
        this.isProcessing = true;

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
                `SELECT last_bounced_date 
                 FROM private.user 
                 WHERE email = $1 
                 AND email_bounced = TRUE`,
                [email]
            );
    
            if (result.length === 0) {
                return false;
            }
    
            const lastBounceDate = result[0].last_bounce_date;
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
            // If bounce is older than a week, reset the bounce status
            if (lastBounceDate < oneWeekAgo) {
                await transaction.query(
                    `UPDATE private.user 
                     SET email_bounced = FALSE,
                        last_bounced_date = NULL,
                        updated_at = CURRENT_TIMESTAMP
                     WHERE email = $1`,
                    [email]
                );

                await transaction.commit();
                return false;
            }
    
            await transaction.commit();
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
                    SET email_bounced = TRUE, 
                        last_bounce_date = $2,
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

    async shutdown(): Promise<void> {
        if (!this.isProcessing) return;

        this.isProcessing = false;

        console.log('EmailService: Shutdown');
    }
}

export const emailServiceInstance = new EmailService();