import type { DBTransaction } from "~~/server/types/db";
import type { UserRegister } from "@@/shared/types/v1/user/registration";



export async function createUserInDB(
    transaction: DBTransaction,
    user_id: string,
    userRegisterRequest: UserRegister,
    password_hash: string,
): Promise<void> {
    try {
        const result = await transaction.query<{ id: string }>(`
            INSERT INTO private.user (
                id,
                public_id,
                email,
                phone_number,
                title,
                first_name,
                last_name,
                profile_url,
                password_hash,
                primary_role,
                status,
                registration_complete,
                verified,
                data_sharing_enabled,
                last_data_sharing_consent_date,
                last_data_sharing_revocation_date
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
            ) RETURNING id
            `, [
                user_id,
                userRegisterRequest.public_id,
                userRegisterRequest.email,
                userRegisterRequest.phone_number,
                userRegisterRequest.title,
                userRegisterRequest.first_name,
                userRegisterRequest.last_name,
                userRegisterRequest.profile_url,
                password_hash,
                userRegisterRequest.primary_role,
                'active',
                true, // registration_complete
                true, // verified

                userRegisterRequest.data_sharing_enabled, // data_sharing_enabled
                (userRegisterRequest.data_sharing_enabled ? new Date() : null), // last_data_sharing_consent_date
                (userRegisterRequest.data_sharing_enabled ? null : new Date()), // last_data_sharing_revocation_date
            ]
        );

        if (!result || result.length === 0 || !result[0]) {
            
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create user'
            });
        }
    }   
    catch (error: unknown) {
        if (
            typeof error === 'object' && 
            error !== null && 
            'code' in error && 
            'constraint' in error && 
            error.code === '23505'
        ) {
            if (error.constraint === 'user_email_key') {
                throw createError({
                    statusCode: 409, // Conflict
                    statusMessage: 'An invitation has already been sent to this email address'
                });
            }

            if (error.constraint === 'user_phone_number_key') {
                throw createError({
                    statusCode: 409, // Conflict
                    statusMessage: 'An invitation has already been sent to this phone number'
                });
            }
        }
        
        throw error;
    }
}