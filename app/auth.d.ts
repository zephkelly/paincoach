import { Role } from "~~lib/shared/types/users";
import { DBUserInvitationDataPartial } from "@@/shared/types/v1/user/invitation/data";
import type { AllRoles } from "@@/shared/types/v1/role";



declare module '#auth-utils' {
    interface User {
        public_id: string;
        first_name: string;

        primary_role: Role;
        roles: Role[];

        profile_url?: string;
        verified: boolean;
    }
    interface UnregisteredUser {
        verified: false;
        first_name: string | null;
        primary_role: 'unregistered';
        roles: AllRoles[];
        profile_url?: string;
    }
   
    interface SecureSessionData {
        id: string;
        public_id: string;
        email: string;

        primary_role: Role;
        roles: Role[];
        verified: boolean;
    }
    interface UnregisteredSecureSessionData {
        id: null;
        public_id: string;
        email: string;
        primary_role: 'unregistered';
        roles: AllRoles[];
        verified: false;

        invitation_token: string;
        invitation_data: DBUserInvitationDataPartial;
    }
   
    interface UserSession {
        user: User;
        secure: SecureSessionData;
        
        logged_in_at: Date;
        version: number;
        id: string; // session id
    }

    interface UnregisteredUserSession {
        user: UnregisteredUser;
        secure: UnregisteredSecureSessionData;
        
        logged_in_at: Date;
        version: number;
        id: string; // session id
    }
}

export { }