import { UserRole } from "~~lib/shared/types/users";
import { UserInvitePartial } from '@@/shared/schemas/user/invitation/create'



declare module '#auth-utils' {
    interface User {
        user_id: string;
        first_name: string;
        user_role: UserRole;
        verified: boolean;
        profile_url?: string;

        owner?: true;
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

        additional_profiles?: UserRole[];

        verified: boolean;
        logged_in_at: Date;
        version: number;
        id: string; // session id
    }
}

export { }