import { Role } from "~~lib/shared/types/users";
import { UserInvitePartial } from '@@/shared/schemas/user/invitation/create'



declare module '#auth-utils' {
    interface User {
        user_uuid: string;
        first_name: string;
        // Change from single role to array
        user_roles: Role[];
        // Add primary role concept
        primary_role: Role;
        verified: boolean;
        profile_url?: string;
    }
   
    interface SecureSessionData {
        user_id: string;
        email: string;
        verified: boolean;
        // Change from single role to array
        user_roles: Role[];
        // Add primary role
        primary_role: Role;
       
        invitation_token?: string;
    }
   
    interface UserSession {
        user: User;
       
        secure: SecureSessionData;
        registration_data?: UserInvitePartial;
        additional_profiles?: Role[];
        verified: boolean;
        logged_in_at: Date;
        version: number;
        id: string; // session id
    }
}

export { }