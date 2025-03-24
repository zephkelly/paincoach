import { DatabaseService } from '~~/server/services/databaseService'



export default defineNitroPlugin(async (nitroApp: any) => {
    const databaseServiceInstance = DatabaseService.getInstance()

    try {
        await databaseServiceInstance.query('SELECT 1')

        console.log('DatabaseService: Connection established')

        if (import.meta.dev) {
            await createTables(databaseServiceInstance)

            await seedPermissions(databaseServiceInstance)
        }
    }
    catch (error) {
        console.error('DatabaseService: Failed to establish database connection:', error)
        throw error
    }

    nitroApp.hooks.hook('close', async () => {
        await databaseServiceInstance.shutdown()
    })
})

async function createTables(db: DatabaseService) {
    await db.query(`
        -- Generate a UUID v7 (time-ordered UUID)
        create or replace function uuid_generate_v7()
        returns uuid
        as $$
        begin
        -- use random v4 uuid as starting point (which has the same variant we need)
        -- then overlay timestamp
        -- then set version 7 by flipping the 2 and 1 bit in the version 4 string
        return encode(
            set_bit(
            set_bit(
                overlay(uuid_send(gen_random_uuid())
                        placing substring(int8send(floor(extract(epoch from clock_timestamp()) * 1000)::bigint) from 3)
                        from 1 for 6
                ),
                52, 1
            ),
            53, 1
            ),
            'hex')::uuid;
        end
        $$
        language plpgsql
        volatile;

        -- Generate a custom UUID v8 with microsecond precision
        create or replace function uuid_generate_v8()
        returns uuid
        as $$
        declare
        timestamp    timestamptz;
        microseconds int;
        begin
        timestamp    = clock_timestamp();
        microseconds = (cast(extract(microseconds from timestamp)::int - (floor(extract(milliseconds from timestamp))::int * 1000) as double precision) * 4.096)::int;

        -- use random v4 uuid as starting point (which has the same variant we need)
        -- then overlay timestamp
        -- then set version 8 and add microseconds
        return encode(
            set_byte(
            set_byte(
                overlay(uuid_send(gen_random_uuid())
                        placing substring(int8send(floor(extract(epoch from timestamp) * 1000)::bigint) from 3)
                        from 1 for 6
                ),
                6, (b'1000' || (microseconds >> 8)::bit(4))::bit(8)::int
            ),
            7, microseconds::bit(8)::int
            ),
            'hex')::uuid;
        end
        $$
        language plpgsql
        volatile;
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS private.role (
            id BIGSERIAL PRIMARY KEY,
            uuid UUID NOT NULL DEFAULT uuid_generate_v7() UNIQUE,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS private.permission (
            id BIGSERIAL PRIMARY KEY,
            uuid UUID NOT NULL DEFAULT uuid_generate_v7() UNIQUE,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            resource_type TEXT NOT NULL,
            action TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS private.user (
            id BIGSERIAL PRIMARY KEY,
            uuid UUID NOT NULL DEFAULT uuid_generate_v7() UNIQUE,
            email TEXT NOT NULL UNIQUE,
            last_email_bounced_date TIMESTAMPTZ,
            verified BOOLEAN DEFAULT false,
            phone_number TEXT UNIQUE,
            title TEXT DEFAULT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT,
            profile_url TEXT,
            password_hash TEXT,
            primary_role TEXT REFERENCES private.role(name) NOT NULL,
            status TEXT DEFAULT 'pending',
            registration_complete BOOLEAN DEFAULT false,
            data_sharing_enabled BOOLEAN DEFAULT false,
            last_data_sharing_consent_date TIMESTAMPTZ,
            last_data_sharing_revocation_date TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            version INT DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS private.user_invitation (
            id BIGSERIAL PRIMARY KEY,
            user_uuid UUID NOT NULL DEFAULT uuid_generate_v7() UNIQUE,
            email TEXT NOT NULL,
            phone_number TEXT,
            linked_user_id BIGINT REFERENCES private.user(id) DEFAULT NULL, 
            invitation_token TEXT NOT NULL DEFAULT uuid_generate_v7() UNIQUE,
            invited_by BIGINT REFERENCES private.user(id) NOT NULL,
            primary_role TEXT REFERENCES private.role(name) NOT NULL,
            roles TEXT[] NOT NULL,
            invitation_data JSONB,
            expires_at TIMESTAMPTZ NOT NULL,
            status TEXT DEFAULT 'pending', -- pending, opened, completed, expired
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS private.user_role (
            user_id BIGINT REFERENCES private.user(id) ON DELETE CASCADE,
            role_id BIGINT REFERENCES private.role(id) ON DELETE CASCADE,
            is_primary BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, role_id)
        );

        CREATE TABLE IF NOT EXISTS private.role_permission (
            role_id BIGINT REFERENCES private.role(id) ON DELETE CASCADE,
            permission_id BIGINT REFERENCES private.permission(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (role_id, permission_id)
        );

        CREATE TABLE IF NOT EXISTS private.user_permission (
            user_id BIGINT REFERENCES private.user(id) ON DELETE CASCADE,
            permission_id BIGINT REFERENCES private.permission(id) ON DELETE CASCADE,
            granted_by BIGINT REFERENCES private.user(id),
            granted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, permission_id)
        );
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS private.clinician_profile (
            user_id BIGINT PRIMARY KEY REFERENCES private.user(id) ON DELETE CASCADE,
            -- Public information (visible to admin and associated patients)
            ahprah_registration_number TEXT NOT NULL,
            specialisation TEXT,
            practice_name TEXT,
            -- Private information (visible only to admin)
            business_address TEXT,
            abn TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS private.patient_profile (
            user_id BIGINT PRIMARY KEY REFERENCES private.user(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS private.email_feedback (
            feedback_id SERIAL PRIMARY KEY,
            email TEXT NOT NULL,
            feedback_type TEXT NOT NULL,
            sub_type TEXT NOT NULL,
            timestamp TIMESTAMP NOT NULL,
            diagnostic TEXT,
            
            CONSTRAINT fk_email
                FOREIGN KEY (email)
                REFERENCES private.user(email)
                ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS private.mailing_list_subscription (
            id BIGINT PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            name TEXT,
            subscription_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            unsubscription_date TIMESTAMPTZ,
            is_active BOOLEAN DEFAULT TRUE,
            unsubscribe_token TEXT UNIQUE,
            source TEXT,
            user_id BIGINT REFERENCES private.user(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

async function seedPermissions(db: DatabaseService) {
    // Existing role creation
    await db.query(`
        INSERT INTO private.role (name, description)
        VALUES
        ('owner', 'System owner with full access'),
        ('admin', 'Administrator with management access'),
        ('clinician', 'Healthcare provider'),
        ('patient', 'End user patient'),
        ('app', 'Ability to access the application')
        ON CONFLICT (name) DO NOTHING;
    `);

    // Insert permissions with clinician-patient relationship
    await db.query(`
        INSERT INTO private.permission (name, description, resource_type, action)
        VALUES
        -- Invitation permissions
        ('Invite Owner', 'Ability to invite owners', 'invitation', 'invite:owner'),
        ('Invite Admin', 'Ability to invite administrators', 'invitation', 'invite:admin'),
        ('Invite Clinician', 'Ability to invite clinicians', 'invitation', 'invite:clinician'),
        ('Invite Patient', 'Ability to invite patients', 'invitation', 'invite:patient'),
        
        -- User data access permissions
        -- Owner data access
        ('View Owner Full', 'View complete owner user data', 'user:owner', 'view:full'),
        ('View Owner Limited', 'View limited owner user data', 'user:owner', 'view:limited'),
        ('View Owner Basic', 'View basic owner user data', 'user:owner', 'view:basic'),
        ('Manage Owner', 'Manage owner user data', 'user:owner', 'manage'),
        
        -- Admin data access
        ('View Admin Full', 'View complete admin user data', 'user:admin', 'view:full'),
        ('View Admin Limited', 'View limited admin user data', 'user:admin', 'view:limited'),
        ('View Admin Basic', 'View basic admin user data', 'user:admin', 'view:basic'),
        ('Manage Admin', 'Manage admin user data', 'user:admin', 'manage'),
        
        -- Clinician data access
        ('View Clinician Full', 'View complete clinician user data', 'user:clinician', 'view:full'),
        ('View Clinician Limited', 'View limited clinician user data', 'user:clinician', 'view:limited'),
        ('View Clinician Basic', 'View basic clinician user data', 'user:clinician', 'view:basic'),
        ('Manage Clinician', 'Manage clinician user data', 'user:clinician', 'manage'),
        
        -- Patient data access (general)
        ('View Patient Full', 'View complete patient user data', 'user:patient', 'view:full'),
        ('View Patient Limited', 'View limited patient user data', 'user:patient', 'view:limited'),
        ('View Patient Basic', 'View basic patient user data', 'user:patient', 'view:basic'),
        ('Manage Patient', 'Manage patient user data', 'user:patient', 'manage'),
        
        -- Clinician-Patient relationship (for clinicians'' own patients)
        ('View Clinician Patient Full', 'View complete data for clinician''s own patients', 'user:clinician-patient', 'view:full'),
        ('View Clinician Patient Limited', 'View limited data for clinician''s own patients', 'user:clinician-patient', 'view:limited'),
        ('View Clinician Patient Basic', 'View basic data for clinician''s own patients', 'user:clinician-patient', 'view:basic'),
        ('Manage Clinician Patient', 'Manage clinician''s own patients', 'user:clinician-patient', 'manage'),
        
        -- App permissions
        ('Use Pain App', 'Ability to use the pain management app', 'app', 'pain:use'),
        ('Use Mood App', 'Ability to use the mood tracking app', 'app', 'mood:use'),
        ('Use Marriage App', 'Ability to use the marriage counseling app', 'app', 'marriage:use')

        ON CONFLICT (name) DO NOTHING;
    `);

    // Owner permissions (can do everything)
    await db.query(`
        INSERT INTO private.role_permission (role_id, permission_id)
        SELECT r.id, p.id
        FROM private.role r, private.permission p
        WHERE r.name = 'owner' AND p.name IN (
            -- Invite permissions
            'Invite Owner', 'Invite Admin', 'Invite Clinician', 'Invite Patient',
            
            -- User data view permissions
            'View Owner Full',
            'View Admin Full',
            'View Clinician Full',
            'View Patient Full',
            
            -- User data manage permissions (except owners)
            'Manage Admin',
            'Manage Clinician',
            'Manage Patient'
        )
        ON CONFLICT DO NOTHING;
    `);

    // Admin permissions
    await db.query(`
        INSERT INTO private.role_permission (role_id, permission_id)
        SELECT r.id, p.id
        FROM private.role r, private.permission p
        WHERE r.name = 'admin' AND p.name IN (
            -- Invite permissions
            'Invite Clinician', 'Invite Patient',
            
            -- User data view permissions
            'View Owner Basic',
            'View Admin Limited',
            'View Clinician Full',
            'View Patient Full',
            
            -- User data manage permissions
            'Manage Clinician',
            'Manage Patient'
        )
        ON CONFLICT DO NOTHING;
    `);

    // Clinician permissions - UPDATED to only manage their own patients
    await db.query(`
        INSERT INTO private.role_permission (role_id, permission_id)
        SELECT r.id, p.id
        FROM private.role r, private.permission p
        WHERE r.name = 'clinician' AND p.name IN (
            -- Invite permissions
            'Invite Patient',
            
            -- User data view permissions
            'View Owner Basic',
            'View Admin Basic',
            'View Clinician Basic',
            'View Patient Basic', -- Changed from FULL to BASIC
            
            -- Clinician-Patient relationship (for their own patients)
            'View Clinician Patient Full',
            'Manage Clinician Patient'
        )
        ON CONFLICT DO NOTHING;
    `);

    // Patient permissions remain the same
    await db.query(`
        INSERT INTO private.role_permission (role_id, permission_id)
        SELECT r.id, p.id
        FROM private.role r, private.permission p
        WHERE r.name = 'patient' AND p.name IN (
            -- Only basic view permissions
            'View Owner Basic',
            'View Admin Basic',
            'View Clinician Basic'
            -- No patient view permissions
            -- No management permissions
        )
        ON CONFLICT DO NOTHING;
    `);

    console.log('DatabaseService: Permissions seeded');
}