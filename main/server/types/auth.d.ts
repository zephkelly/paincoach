import { UserRole } from "./users";
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

    interface UserSession {
        user: User;

        secure: SecureSessionData;

        verified: boolean;
        logged_in_at: Date;
        version: number;
    }

    interface IncompleteUserSession {
        registration_data: UserInvitePartial;

        logged_in_at: Date;
    }

}

export { }