import { UserRole } from "./users";



declare module '#auth-utils' {
    interface User {
        user_id: string;
        email: string;
        name: string;
        user_role: UserRole;
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
}
  
export {}