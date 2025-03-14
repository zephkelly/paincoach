import { UserRole } from "~~lib/shared/types/users";
import { UserInvitePartial } from '@@/shared/schemas/users/invitation/request'



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
        
        invitation_token?: string;
    }
    
    interface UserSession {
        user: User;
        
        secure: SecureSessionData;

        registration_data?: UserInvitePartial;

        verified: boolean;
        logged_in_at: Date;
        version: number;
        id: string; // session id
    }
}

export { }