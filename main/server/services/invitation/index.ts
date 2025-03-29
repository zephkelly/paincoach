import type { UserSession, UnregisteredUserSession } from '#auth-utils';
import type { Role } from '@@/shared/types/v1/role';

import { PERMISSIONS, type Permission } from '@@/shared/schemas/v1/permission';

import { getInvitation } from './function/getInvitation';

import { DatabaseService } from '~~/server/services/databaseService';
import { EmailService } from '~~/server/services/emailService';

import type { CreateUserInvitationRequest } from '@@/shared/types/v1/user/invitation/create';
import { UUID7 } from '@@/shared/utils/uuid';



export class InvitationService {
    public static async getInvitation(token: string, session: UserSession | UnregisteredUserSession, permissions: Permission[]) {
        return await getInvitation(token, session, permissions);
    }

    // Move to createInvitation.ts
    public static async createInvitation(
        invitationData: CreateUserInvitationRequest,
        session: UserSession | UnregisteredUserSession,
        permissions: Permission[],
    ) {
        const typedSession = session as UserSession;

        const desiredRoles = invitationData.roles;

        const user_id = typedSession.secure?.id;

        if (!user_id) {
            throw createError({
                statusCode: 403,
                statusMessage: 'User ID not found in session'
            });
        }

        const roleToPermissionMap = {
            'admin': PERMISSIONS.INVITATION.INVITE.ADMIN,
            'clinician': PERMISSIONS.INVITATION.INVITE.CLINICIAN,
            'patient': PERMISSIONS.INVITATION.INVITE.PATIENT,
            'owner': PERMISSIONS.INVITATION.INVITE.OWNER,
            'app': PERMISSIONS.INVITATION.INVITE.APP,
        };
        
        // Create array of required permissions based on desired roles
        const requiredPermissions = desiredRoles.map(role => {
            const permission = roleToPermissionMap[role];
            if (!permission) {
                throw createError({
                    statusCode: 400,
                    statusMessage: `Invalid role: ${role}`
                });
            }
            return permission;
        });
        
        // Check if user has all required permissions
        if (!hasPermission(permissions, requiredPermissions, true)) {
            throw createError({
                statusCode: 403,
                statusMessage: 'You do not have permission to assign one or more of these roles'
            });
        }

        const invitationToken = UUID7.generate();

        const db = await DatabaseService.getInstance();

        try {
            await db.query(`
                INSERT INTO private.user_invitation (
                    email,
                    phone_number,
                    invitation_token,
                    invited_by_user_id,
                    primary_role,
                    roles,
                    expires_at,
                    invitation_data,
                    status,
                    public_user_id
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, uuid_generate_v7()
                )
            `, [
                invitationData.email,
                invitationData.phone_number || null,
                invitationToken,
                user_id,
                invitationData.primary_role,
                desiredRoles,
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                invitationData.invitation_data,
                'pending'
            ]);
        }
        catch (error: unknown) {
            if (
                typeof error === 'object' && 
                error !== null && 
                'code' in error && 
                'constraint' in error && 
                error.code === '23505' && 
                error.constraint === 'user_invitation_email_key'
            ) {
                throw createError({
                    statusCode: 409, // Conflict
                    statusMessage: 'An invitation has already been sent to this email address'
                });
            }
            
            // Re-throw any other errors
            throw error;
        }

        try {
            const inviterName = typedSession.user?.first_name || 'Pain Coach Admin';
            
            await this.sendInvitationEmail(
                invitationData.email,
                invitationToken,
                inviterName,
                desiredRoles,
                invitationData.primary_role,
                typedSession.user?.profile_url
            );
            
            console.log(`Invitation email sent successfully to ${invitationData.email}`);
        }
        catch (error: unknown) {
            console.error('Error sending invitation email:', error);
        }
    }



    // Move this to a separate file
    private static roleConfig: Record<Role, {
        displayName: string;
        priority: number;
    }> = {
        owner: {
            displayName: "Owner",
            priority: 1
        },
        admin: {
            displayName: "Admin",
            priority: 2
        },
        clinician: {
            displayName: "Clinician",
            priority: 3
        },
        patient: {
            displayName: "Patient",
            priority: 4
        },
        app: {
            displayName: "App User",
            priority: 5
        },
    };

    private static renderRoleChip(role: Role): string {
        const roleInfo = this.roleConfig[role];
        return `
            <div style="display: inline-block; padding: 4px 8px; 
                       margin: 0 4px 8px 4px; border-radius: 4px; 
                       background-color: #171717; border: 1px solid #333333;
                       font-size: 12px; color: #f0f0f0; text-align: center;">
                <span style="font-weight: 500;">${roleInfo.displayName}</span>
            </div>
        `;
    }

    // Generate appropriate email subject based on roles
    private static getEmailSubject(primaryRole: Role): string {
        switch (primaryRole) {
            case 'owner':
            case 'admin':
                return 'Your Administrative Access to Pain Coach';
            case 'clinician':
                return 'Your exclusive access to Pain Coach';
            case 'patient':
                return 'Complete your Pain Coach registration';
            case 'app':
            default:
                return 'You\'ve been invited to Pain Coach';
        }
    }

    // Generate appropriate call-to-action button text
    private static getButtonText(primaryRole: Role): string {
        switch (primaryRole) {
            case 'owner':
            case 'admin':
                return 'Accept Admin Invitation';
            case 'clinician':
                return 'Go to Dashboard';
            default:
                return 'Complete Registration';
        }
    }

    // Generate title for the email
    private static getEmailTitle(primaryRole: Role): string {
        switch (primaryRole) {
            case 'owner':
            case 'admin':
                return 'Administrator Invitation';
            case 'clinician':
                return 'Clinician Invitation';
            case 'patient':
                return 'Patient Invitation';
            case 'app':
            default:
                return 'Pain Coach Invitation';
        }
    }

    private static getEmailContent(primaryRole: Role, roles: Role[], inviteeName: string, hasMultipleRoles: boolean, profileImageUrl?: string): string {
        let content = `
            <h2 class="text-dark" style="color: #0f0f0f; font-size: 22px; font-weight: 600; margin-bottom: 8px;">${this.getEmailTitle(primaryRole)}</h2>
        `;
    
        // Add inviter information if available
        if (inviteeName) {
            content += `
                <p class="text-secondary-dark" style="color: #555555; font-size: 14px; margin-bottom: 24px; line-height: 1.5;">
                    by ${inviteeName}
                </p>
            `;
        }
    
        // Add role-specific content
        switch (primaryRole) {
            case 'owner':
            case 'admin':
                content += `
                    <p class="text-secondary-dark" style="color: #333333; font-size: 16px; margin-bottom: 24px;">
                        You have been invited to become an Administrator at Pain Coach. Gain full platform access and help shape the future of pain management.
                    </p>
                `;
                break;
            case 'clinician':
                content += `
                    <p class="text-secondary-dark" style="color: #333333; font-size: 16px; margin-bottom: 24px;">
                        You have been invited to become a member at Pain Coach. Complete your registration to begin adding patients and providing exceptional care.
                    </p>
                `;
                break;
            case 'patient':
                content += `
                    <p class="text-secondary-dark" style="color: #333333; font-size: 16px; margin-bottom: 24px;">
                        You have been invited to become a member at Pain Coach. Get personalized care and guidance to help manage your pain effectively.
                    </p>
                `;
                break;
            case 'app':
            default:
                content += `
                    <p class="text-secondary-dark" style="color: #333333; font-size: 16px; margin-bottom: 24px;">
                        You have been invited to join Pain Coach. Complete your registration to access your personalized pain management platform.
                    </p>
                `;
                break;
        }
    
        // If user has multiple roles, display all the roles
        if (hasMultipleRoles) {
            // Sort roles by priority
            const sortedRoles = [...roles].sort((a, b) => this.roleConfig[a].priority - this.roleConfig[b].priority);
            
            content += `
                <p class="text-secondary-dark" style="color: #333333; font-size: 16px; margin-bottom: 10px; text-align: center;">
                    You have been granted the following roles: ${sortedRoles.map(role => this.renderRoleChip(role)).join('')}
                </p>
            `;
        }
    
        return content;
    }

    /**
     * Sends an invitation email based on the user's assigned roles
     */
    public static async sendInvitationEmail(
        email: string,
        inviteToken: string,
        inviteeName: string,
        roles: Role[],
        primaryRole: Role,
        profileImageUrl?: string
    ): Promise<string> {

        const hasMultipleRoles = roles.length > 1;
        
        const config = useRuntimeConfig();
        const ENVIRONMENT_DOMAIN = config.environmentDomain;
        const NOREPLY_EMAIL = config.aws.ses.noreply;
        
        const registrationUrl = `${ENVIRONMENT_DOMAIN}/r/register/invite/${inviteToken}`;
        
        // Generate email content based on roles
        const content = this.getEmailContent(
            primaryRole,
            roles,
            inviteeName,
            hasMultipleRoles,
            profileImageUrl
        );
        
        const buttonText = this.getButtonText(primaryRole);

        const emailService = EmailService.getInstance();
        
        return emailService.sendEmail({
            to: email,
            subject: this.getEmailSubject(primaryRole),
            html: emailService.getInvitationEmailTemplate(content, buttonText, registrationUrl),
            from: {
                name: 'Pain Coach',
                address: NOREPLY_EMAIL
            },
            highPriority: primaryRole === 'admin' || primaryRole === 'owner'
        });
    }
}