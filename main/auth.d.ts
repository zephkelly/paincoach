import { Role } from "~~lib/shared/types/users";
import { DBUserInvitationPartial } from "@@/shared/types/v1/user/invitation";



declare module '#auth-utils' {
    interface User {
        user_uuid: string;
        first_name: string;

        primary_role: Role;
        roles: Role[];

        profile_url?: string;
        verified: boolean;
    }
   
    interface SecureSessionData {
        user_id: number | bigint;
        user_uuid: string;
        email: string;

        primary_role: Role;
        roles: Role[];
        verified: boolean;
       
        invitation_token?: string;
    }
   
    interface UserSession {
        user: User;
       
        secure: SecureSessionData;
        invitation_data?: UserInvitePartial;
        
        logged_in_at: Date;
        version: number;
        id: string; // session id
    }
}

export { }