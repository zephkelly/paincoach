import { DatabaseService } from '~~/server/services/databaseService'
import { setupInvitationTables } from '../utils/database/invitation'
import { createDailyPainRecordTable } from '../utils/database/record/daily/pain'



export default defineNitroPlugin(async (nitroApp: any) => {
    const databaseServiceInstance = DatabaseService.getInstance()

    try {
        await databaseServiceInstance.query('SELECT 1')

        console.log('DatabaseService: Connection established')

        if (import.meta.dev) {
            await createTables(databaseServiceInstance)

            // await seedPermissions(databaseServiceInstance)
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
            -- Core components of the permission string
            resource_type TEXT NOT NULL,
            resource_subtype TEXT,
            action TEXT NOT NULL,
            action_subtype TEXT,
            access_level TEXT NOT NULL,
            access_level_subtype TEXT,
            -- Metadata
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS private.user (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
            public_id UUID NOT NULL DEFAULT uuid_generate_v7() UNIQUE,
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
        `);

        await setupInvitationTables(db)

    await db.query(`
        CREATE TABLE IF NOT EXISTS private.user_role (
            user_id UUID REFERENCES private.user(id) ON DELETE CASCADE,
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
            user_id UUID REFERENCES private.user(id) ON DELETE CASCADE,
            permission_id BIGINT REFERENCES private.permission(id) ON DELETE CASCADE,
            granted_by UUID REFERENCES private.user(id),
            granted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, permission_id)
        );
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS private.app_profile (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
            user_id UUID NOT NULL REFERENCES private.user(id) ON DELETE CASCADE,
            app_type TEXT NOT NULL, -- 'pain', 'mood', 'marriage', etc.
            
            -- App access and state
            is_enabled BOOLEAN DEFAULT TRUE,
            
            -- Onboarding and usage tracking
            first_access_date TIMESTAMPTZ,
            last_access_date TIMESTAMPTZ,
            completed_onboarding BOOLEAN DEFAULT FALSE,
            onboarding_completion_date TIMESTAMPTZ,
            
            desired_record_interval INTEGER DEFAULT 0 CHECK (record_interval > 0), -- in minutes
            last_record_request_date TIMESTAMPTZ,
            
            -- Usage metrics
            session_count INTEGER DEFAULT 0,
            total_usage_minutes INTEGER DEFAULT 0,
            
            -- Metadata
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            
            -- Unique constraint to ensure one profile per user per app type
            UNIQUE(user_id, app_type)
        );

        CREATE TABLE IF NOT EXISTS private.clinician_profile (
            user_id UUID PRIMARY KEY REFERENCES private.user(id) ON DELETE CASCADE,
            ahpra_registration_number TEXT NOT NULL,
            specialisation TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS private.patient_profile (
            user_id UUID PRIMARY KEY REFERENCES private.user(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS private.clinician_patient (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
            clinician_id UUID NOT NULL REFERENCES private.user(id) ON DELETE CASCADE,
            patient_id UUID NOT NULL REFERENCES private.user(id) ON DELETE CASCADE,
            relationship_status TEXT NOT NULL DEFAULT 'active', -- active, paused, terminated
            start_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            end_date TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            
            -- Ensure a patient can only be linked to the same clinician once
            UNIQUE(clinician_id, patient_id)
        );

        CREATE OR REPLACE FUNCTION private.validate_clinician_patient_roles()
        RETURNS TRIGGER AS $$
        DECLARE
            clinician_role TEXT;
            patient_role TEXT;
        BEGIN
            -- Get clinician's primary role
            SELECT primary_role INTO clinician_role FROM private.user WHERE id = NEW.clinician_id;
            
            -- Get patient's primary role
            SELECT primary_role INTO patient_role FROM private.user WHERE id = NEW.patient_id;
            
            -- Validate roles
            IF clinician_role <> 'clinician' THEN
                RAISE EXCEPTION 'User % is not a clinician', NEW.clinician_id;
            END IF;
            
            IF patient_role <> 'patient' THEN
                RAISE EXCEPTION 'User % is not a patient', NEW.patient_id;
            END IF;
            
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE OR REPLACE TRIGGER validate_clinician_patient_roles_trigger
        BEFORE INSERT OR UPDATE ON private.clinician_patient
        FOR EACH ROW EXECUTE FUNCTION private.validate_clinician_patient_roles();


        -- Table to store clinician-patient record settings used to overwrite app_profile settings
        CREATE TABLE IF NOT EXISTS private.clinician_patient_record_settings (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
            clinician_patient_id UUID NOT NULL REFERENCES private.clinician_patient(id) ON DELETE CASCADE,
            app_type TEXT NOT NULL, -- 'pain', 'mood', 'marriage', etc.
            
            -- Record interval settings that override app_profile settings
            desired_record_interval INTEGER NOT NULL CHECK (desired_record_interval > 0), -- in hours
            override_patient_settings BOOLEAN DEFAULT TRUE, -- If false, patient settings take precedence
            
            -- Notes for the clinician about this setting
            notes TEXT,
            
            -- Metadata
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            created_by UUID REFERENCES private.user(id),
            updated_by UUID REFERENCES private.user(id),
            
            -- Ensure one setting per clinician-patient relationship per app type
            UNIQUE(clinician_patient_id, app_type)
        );

        CREATE OR REPLACE VIEW private.patient_record_settings AS
        SELECT 
            u.id AS user_id,
            u.email,
            u.first_name,
            u.last_name,
            ap.app_type,
            COALESCE(
                -- Use clinician settings if they exist and override is enabled
                CASE WHEN cprs.override_patient_settings THEN cprs.desired_record_interval ELSE NULL END,
                -- Otherwise use patient's own app_profile settings
                ap.desired_record_interval
            ) AS effective_record_interval,
            ap.desired_record_interval AS patient_record_interval,
            cprs.desired_record_interval AS clinician_record_interval,
            cprs.override_patient_settings,
            cp.clinician_id,
            cu.first_name AS clinician_first_name,
            cu.last_name AS clinician_last_name,
            ap.last_record_request_date
        FROM 
            private.user u
        JOIN 
            private.app_profile ap ON u.id = ap.user_id
        LEFT JOIN 
            private.clinician_patient cp ON u.id = cp.patient_id AND cp.relationship_status = 'active'
        LEFT JOIN 
            private.clinician_patient_record_settings cprs ON cp.id = cprs.clinician_patient_id AND ap.app_type = cprs.app_type
        LEFT JOIN
            private.user cu ON cp.clinician_id = cu.id
        WHERE
            u.primary_role = 'patient' AND ap.is_enabled = TRUE;
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS private.email_feedback (
            feedback_id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
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
            id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
            email TEXT NOT NULL UNIQUE,
            name TEXT,
            subscription_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            unsubscription_date TIMESTAMPTZ,
            is_active BOOLEAN DEFAULT TRUE,
            unsubscribe_token TEXT UNIQUE,
            source TEXT,
            user_id UUID REFERENCES private.user(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await createDailyPainRecordTable(db)
}

async function seedPermissions(db: DatabaseService) {
    // Ensure roles exist first
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

    // Helper function to insert permissions with the new structure
    async function insertPermission(
        name: string,
        description: string,
        resourceType: string,
        action: string,
        accessLevel: string,
        resourceSubtype?: string,
        actionSubtype?: string,
        accessLevelSubtype?: string
    ) {
        await db.query(`
            INSERT INTO private.permission (
                name, 
                description, 
                resource_type, 
                resource_subtype, 
                action, 
                action_subtype, 
                access_level, 
                access_level_subtype
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (name) DO UPDATE SET
                description = EXCLUDED.description,
                resource_type = EXCLUDED.resource_type,
                resource_subtype = EXCLUDED.resource_subtype,
                action = EXCLUDED.action,
                action_subtype = EXCLUDED.action_subtype,
                access_level = EXCLUDED.access_level,
                access_level_subtype = EXCLUDED.access_level_subtype;
        `, [
            name, 
            description, 
            resourceType, 
            resourceSubtype || null, 
            action, 
            actionSubtype || null, 
            accessLevel, 
            accessLevelSubtype || null
        ]);
    }

    // Insert invitation permissions
    await insertPermission(
        'Invite Owner', 
        'Ability to invite owners', 
        'invitation', 
        'invite', 
        'full', 
        'owner'
    );
    
    await insertPermission(
        'Invite Admin', 
        'Ability to invite administrators', 
        'invitation', 
        'invite', 
        'full', 
        'admin'
    );
    
    await insertPermission(
        'Invite Clinician', 
        'Ability to invite clinicians', 
        'invitation', 
        'invite', 
        'full', 
        'clinician'
    );
    
    await insertPermission(
        'Invite Patient', 
        'Ability to invite patients', 
        'invitation', 
        'invite', 
        'full', 
        'patient'
    );

    await insertPermission(
        'Invite App User', 
        'Ability to invite users with app access', 
        'invitation', 
        'invite', 
        'full', 
        'app'
    );
    
    // Insert invitation view permissions with different access levels
    await insertPermission(
        'View Invitations Full', 
        'Ability to view all invitations with full details', 
        'invitation', 
        'view', 
        'full'
    );

    await insertPermission(
        'View Invitations Limited', 
        'Ability to view all invitations with limited details', 
        'invitation', 
        'view', 
        'limited'
    );

    await insertPermission(
        'View Invitations Basic', 
        'Ability to view all invitations with basic details', 
        'invitation', 
        'view', 
        'basic'
    );

    await insertPermission(
        'View Clinician-Patient Invitations',
        'Ability for clinicians to view invitations they sent to patients',
        'invitation',
        'view',
        'limited',
        'clinician-patient'
    );
      
    // Insert permissions for users to view their own invitations
    await insertPermission(
        'View Own Invitation Full', 
        'Ability to view your own invitation with full details', 
        'invitation', 
        'view', 
        'full', 
        'own'
    );

    await insertPermission(
        'View Own Invitation Limited', 
        'Ability to view your own invitation with limited details', 
        'invitation', 
        'view', 
        'limited', 
        'own'
    );

    await insertPermission(
        'View Own Invitation Basic', 
        'Ability to view your own invitation with basic details', 
        'invitation', 
        'view', 
        'basic', 
        'own'
    );

    // Insert user data access permissions - Owner
    await insertPermission(
        'View Owner Full', 
        'View complete owner user data', 
        'user', 
        'view', 
        'full', 
        'owner'
    );
    
    await insertPermission(
        'View Owner Limited', 
        'View limited owner user data', 
        'user', 
        'view', 
        'limited', 
        'owner'
    );
    
    await insertPermission(
        'View Owner Basic', 
        'View basic owner user data', 
        'user', 
        'view', 
        'basic', 
        'owner'
    );
    
    await insertPermission(
        'Manage Owner', 
        'Manage owner user data', 
        'user', 
        'manage', 
        'full', 
        'owner'
    );

    // Insert user data access permissions - Admin
    await insertPermission(
        'View Admin Full', 
        'View complete admin user data', 
        'user', 
        'view', 
        'full', 
        'admin'
    );
    
    await insertPermission(
        'View Admin Limited', 
        'View limited admin user data', 
        'user', 
        'view', 
        'limited', 
        'admin'
    );
    
    await insertPermission(
        'View Admin Basic', 
        'View basic admin user data', 
        'user', 
        'view', 
        'basic', 
        'admin'
    );
    
    await insertPermission(
        'Manage Admin', 
        'Manage admin user data', 
        'user', 
        'manage', 
        'full', 
        'admin'
    );

    // Insert user data access permissions - Clinician
    await insertPermission(
        'View Clinician Full', 
        'View complete clinician user data', 
        'user', 
        'view', 
        'full', 
        'clinician'
    );
    
    await insertPermission(
        'View Clinician Limited', 
        'View limited clinician user data', 
        'user', 
        'view', 
        'limited', 
        'clinician'
    );
    
    await insertPermission(
        'View Clinician Basic', 
        'View basic clinician user data', 
        'user', 
        'view', 
        'basic', 
        'clinician'
    );
    
    await insertPermission(
        'Manage Clinician', 
        'Manage clinician user data', 
        'user', 
        'manage', 
        'full', 
        'clinician'
    );

    // Insert user data access permissions - Patient
    await insertPermission(
        'View Patient Full', 
        'View complete patient user data', 
        'user', 
        'view', 
        'full', 
        'patient'
    );
    
    await insertPermission(
        'View Patient Limited', 
        'View limited patient user data', 
        'user', 
        'view', 
        'limited', 
        'patient'
    );
    
    await insertPermission(
        'View Patient Basic', 
        'View basic patient user data', 
        'user', 
        'view', 
        'basic', 
        'patient'
    );
    
    await insertPermission(
        'Manage Patient', 
        'Manage patient user data', 
        'user', 
        'manage', 
        'full', 
        'patient'
    );

    // Insert clinician-patient relationship permissions
    await insertPermission(
        'View Clinician Patient Full', 
        'View complete data for clinician\'s own patients', 
        'user', 
        'view', 
        'full', 
        'clinician-patient'
    );
    
    await insertPermission(
        'View Clinician Patient Limited', 
        'View limited data for clinician\'s own patients', 
        'user', 
        'view', 
        'limited', 
        'clinician-patient'
    );
    
    await insertPermission(
        'View Clinician Patient Basic', 
        'View basic data for clinician\'s own patients', 
        'user', 
        'view', 
        'basic', 
        'clinician-patient'
    );
    
    await insertPermission(
        'Manage Clinician Patient', 
        'Manage clinician\'s own patients', 
        'user', 
        'manage', 
        'full', 
        'clinician-patient'
    );

    // Insert permissions for users to view their own profile
    await insertPermission(
        'View Own User Full', 
        'Ability to view your own user profile with full details', 
        'user', 
        'view', 
        'full', 
        'own'
    );

    await insertPermission(
        'View Own User Limited', 
        'Ability to view your own user profile with limited details', 
        'user', 
        'view', 
        'limited', 
        'own'
    );

    await insertPermission(
        'View Own User Basic', 
        'Ability to view your own user profile with basic details', 
        'user', 
        'view', 
        'basic', 
        'own'
    );

    // Insert app permissions
    await insertPermission(
        'Use Pain App', 
        'Ability to use the pain management app', 
        'app', 
        'use', 
        'full', 
        'pain'
    );
    
    await insertPermission(
        'Use Mood App', 
        'Ability to use the mood tracking app', 
        'app', 
        'use', 
        'full', 
        'mood'
    );
    
    await insertPermission(
        'Use Marriage App', 
        'Ability to use the marriage counseling app', 
        'app', 
        'use', 
        'full', 
        'marriage'
    );


    // Owner permissions (can do everything)
    await db.query(`
        INSERT INTO private.role_permission (role_id, permission_id)
        SELECT r.id, p.id
        FROM private.role r, private.permission p
        WHERE r.name = 'owner' AND p.name IN (
            -- Invite permissions
            'Invite Owner', 'Invite Admin', 'Invite Clinician', 'Invite Patient', 'Invite App User',
            
            -- Invitation view permissions
            'View Invitations Full', 'View Own Invitation Full',
            
            -- User data view permissions
            'View Owner Full',
            'View Admin Full',
            'View Clinician Full',
            'View Patient Full',
            'View Own User Full',
            
            -- User data manage permissions (except owners)
            'Manage Admin',
            'Manage Clinician',
            'Manage Patient',
            
            -- App permissions
            'Use Pain App', 'Use Mood App', 'Use Marriage App'
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
            'Invite Clinician', 'Invite Patient', 'Invite App User',
            
            -- Invitation view permissions
            'View Invitations Full', 'View Own Invitation Full',
            
            -- User data view permissions
            'View Owner Basic',
            'View Admin Limited',
            'View Clinician Full',
            'View Patient Full',
            'View Own User Full',
            
            -- User data manage permissions
            'Manage Clinician',
            'Manage Patient',
            
            -- App permissions
            'Use Pain App', 'Use Mood App', 'Use Marriage App'
        )
        ON CONFLICT DO NOTHING;
    `);

    // Clinician permissions
    await db.query(`
        INSERT INTO private.role_permission (role_id, permission_id)
        SELECT r.id, p.id
        FROM private.role r, private.permission p
        WHERE r.name = 'clinician' AND p.name IN (
            -- Invite permissions
            'Invite Patient', 'Invite App User',
            
            -- Invitation view permissions
            'View Clinician-Patient Invitations', 'View Own Invitation Full',
            
            -- User data view permissions
            'View Owner Basic',
            'View Admin Basic',
            'View Clinician Basic',
            'View Patient Basic',
            'View Own User Full',
            
            -- Clinician-Patient relationship permissions
            'View Clinician Patient Full',
            'Manage Clinician Patient',
            
            -- App permissions
            'Use Pain App', 'Use Mood App', 'Use Marriage App'
        )
        ON CONFLICT DO NOTHING;
    `);

    // Patient permissions
    await db.query(`
        INSERT INTO private.role_permission (role_id, permission_id)
        SELECT r.id, p.id
        FROM private.role r, private.permission p
        WHERE r.name = 'patient' AND p.name IN (
            -- Invitation view permissions
            'View Own Invitation Limited',
            
            -- User data view permissions
            'View Owner Basic',
            'View Admin Basic',
            'View Clinician Basic',
            'View Own User Limited',
            
            -- App permissions
            'Use Pain App', 'Use Mood App'
        )
        ON CONFLICT DO NOTHING;
    `);

    console.log('DatabaseService: Permissions seeded with new structure');
}