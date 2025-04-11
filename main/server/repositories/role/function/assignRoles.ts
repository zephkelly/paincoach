import type { DBTransaction } from "~~/server/types/db";



/**
     * Assign roles to a user
     */
export async function assignRolesToUser(
    transaction: DBTransaction,
    userId: string, 
    roles: string[], 
    primaryRole: string
): Promise<void> {
    const rolesResult = await transaction.query<{ id: string, name: string }>(`
        SELECT id, name FROM private.role 
        WHERE name = ANY($1)
    `, [roles]);
    
    for (const role of rolesResult) {
        const isPrimary = role.name === primaryRole;
        
        await transaction.query(`
            INSERT INTO private.user_role (
                user_id, 
                role_id, 
                is_primary
            ) VALUES (
                $1, $2, $3
            )
            ON CONFLICT (user_id, role_id) 
            DO UPDATE SET is_primary = $3
        `, [
            userId,
            role.id,
            isPrimary
        ]);
    }
}