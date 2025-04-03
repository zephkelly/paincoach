import type { Role } from '@@/shared/types/v1/role';

import { EmailService } from '~~/server/services/emailService';



const roleConfig: Record<Role, {
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

function renderRoleChip(role: Role): string {
    const roleInfo = roleConfig[role];
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
function getEmailSubject(primaryRole: Role): string {
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
function getButtonText(primaryRole: Role): string {
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
function getEmailTitle(primaryRole: Role): string {
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

function getEmailContent(primaryRole: Role, roles: Role[], inviteeName: string, hasMultipleRoles: boolean): string {
    let content = `
        <h2 class="text-dark" style="color: #0f0f0f; font-size: 22px; font-weight: 600; margin-bottom: 8px;">${getEmailTitle(primaryRole)}</h2>
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
        const sortedRoles = [...roles].sort((a, b) => roleConfig[a].priority - roleConfig[b].priority);
        
        content += `
            <p class="text-secondary-dark" style="color: #333333; font-size: 16px; margin-bottom: 10px; text-align: center;">
                You have been granted the following roles: ${sortedRoles.map(role => renderRoleChip(role)).join('')}
            </p>
        `;
    }

    return content;
}

/**
 * Sends an invitation email based on the user's assigned roles
 */
export async function sendInvitationEmail(
    email: string,
    inviteToken: string,
    roles: Role[],
    primaryRole: Role,
    inviteeName: string,
): Promise<string> {

    const hasMultipleRoles = roles.length > 1;
    
    const config = useRuntimeConfig();
    const ENVIRONMENT_DOMAIN = config.environmentDomain;
    const NOREPLY_EMAIL = config.aws.ses.noreply;
    
    const registrationUrl = `${ENVIRONMENT_DOMAIN}/r/register/invite/${inviteToken}`;
    
    // Generate email content based on roles
    const content = getEmailContent(
        primaryRole,
        roles,
        inviteeName,
        hasMultipleRoles,
    );
    
    const buttonText = getButtonText(primaryRole);

    const emailService = EmailService.getInstance();
    
    return emailService.sendEmail({
        to: email,
        subject: getEmailSubject(primaryRole),
        html: emailService.getInvitationEmailTemplate(content, buttonText, registrationUrl),
        from: {
            name: 'Pain Coach',
            address: NOREPLY_EMAIL
        },
        highPriority: primaryRole === 'admin' || primaryRole === 'owner'
    });
}