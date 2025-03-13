import { UserRole } from "~~lib/shared/types/users";
import { UserInvitePartial } from '~~lib/shared/schemas/users/invitation/request'



declare module '#auth-utils' {
    interface User {
        user_id: string;
        first_name: string;
        user_role: UserRole;
        verified: boolean;
        profile_url?: string;
    }

    interface SecureSessionData {
        user_id: string;
        email: string;
        verified: boolean;
        user_role: UserRole;
    }

    interface IncompleteUser {
        registration_data: UserInvitePartial;
    }

    interface UserSession {
        user: User | IncompleteUser;

        secure: SecureSessionData | { invitation_token: string };

        verified: boolean;
        logged_in_at: Date;
        version: number;
        id: string; // session id
    }
}

export { }