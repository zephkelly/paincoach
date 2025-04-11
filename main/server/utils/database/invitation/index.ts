import { DatabaseService } from "~~/server/services/databaseService";


export async function setupInvitationTables(db: DatabaseService) {
    // return Promise.all([
    //     createInvitationTable(db),
    //     createInvitationHistoryTable(db),
    // ]);

    await db.query(`
        CREATE SCHEMA IF NOT EXISTS invitation;

        -- Move user_invitation table to invitation schema
        CREATE TABLE IF NOT EXISTS invitation.user_invitation (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
            user_uuid UUID NOT NULL DEFAULT uuid_generate_v7() UNIQUE,
            email TEXT NOT NULL UNIQUE,
            phone_number TEXT,
            linked_user_id UUID REFERENCES private.user(id) DEFAULT NULL,
            invitation_token TEXT NOT NULL DEFAULT uuid_generate_v7() UNIQUE,
            invited_by_user_id UUID REFERENCES private.user(id) NOT NULL,
            primary_role TEXT REFERENCES private.role(name) NOT NULL,
            roles TEXT[] NOT NULL,
            invitation_data JSONB,
            expires_at TIMESTAMPTZ NOT NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            public_user_id UUID DEFAULT uuid_generate_v7()
        );

        -- Move user_invitation_history table to invitation schema
        CREATE TABLE IF NOT EXISTS invitation.user_invitation_history (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
            user_invitation_id UUID REFERENCES invitation.user_invitation(id) NOT NULL,
            caused_by_user_id UUID REFERENCES private.user(id),
            status TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- Create view for user invitations with their current status
        CREATE OR REPLACE VIEW invitation.user_invitation_with_status AS
        WITH latest_statuses AS (
            SELECT 
                user_invitation_id,
                status,
                ROW_NUMBER() OVER (PARTITION BY user_invitation_id ORDER BY created_at DESC) as rn
            FROM invitation.user_invitation_history
        )
        SELECT 
            ui.*,
            ls.status as current_status
        FROM invitation.user_invitation ui
        LEFT JOIN latest_statuses ls ON ui.id = ls.user_invitation_id AND ls.rn = 1;
    `);
}


// export async function createInvitationTable(db: DatabaseService) {
//     await db.query(`
//         CREATE TABLE IF NOT EXISTS private.user_invitation (
//             id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
//             user_uuid UUID NOT NULL DEFAULT uuid_generate_v7() UNIQUE,
//             email TEXT NOT NULL UNIQUE,
//             phone_number TEXT,
//             linked_user_id UUID REFERENCES private.user(id) ON DELETE SET NULL, 
//             invitation_token TEXT NOT NULL DEFAULT uuid_generate_v7() UNIQUE,
//             invited_by_user_id UUID REFERENCES private.user(id) NOT NULL,
//             primary_role TEXT REFERENCES private.role(name) NOT NULL,
//             roles TEXT[] NOT NULL,
//             invitation_data JSONB,
//             expires_at TIMESTAMPTZ NOT NULL,
//             status TEXT DEFAULT 'pending',
//             created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
//         );
//     `);
// }

// export async function createInvitationHistoryTable(db: DatabaseService) {
//     await db.query(`
//         CREATE TABLE IF NOT EXISTS private.user_invitation_history (
//             id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
//             user_invitation_id UUID REFERENCES private.user_invitation(id) NOT NULL,
//             caused_by_user_id UUID REFERENCES private.user(id),
//             status TEXT NOT NULL,
//             created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
//         );
//     `);
// }