import { DatabaseService } from '~~/server/services/databaseService'



export default defineNitroPlugin(async (nitroApp: any) => {
    const databaseServiceInstance = DatabaseService.getInstance()

    try {
        await databaseServiceInstance.query('SELECT 1')

        console.log('DatabaseService: Connection established')

        await createTables(databaseServiceInstance)
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
        CREATE TABLE IF NOT EXISTS private.role (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS private.permission (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            resource_type TEXT NOT NULL,
            action TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS private.role_permission (
            role_id UUID REFERENCES private.role(id) ON DELETE CASCADE,
            permission_id UUID REFERENCES private.permission(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (role_id, permission_id)
        );

        -- Base users table
        CREATE TABLE IF NOT EXISTS private.user (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT NOT NULL UNIQUE,
            last_email_bounced_date TIMESTAMPTZ,
            verified BOOLEAN DEFAULT false,
            phone_number TEXT UNIQUE,
            title TEXT DEFAULT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT,
            profile_url TEXT,
            password_hash TEXT,
            role_id UUID REFERENCES private.role(id),
            status TEXT DEFAULT 'pending',
            registration_complete BOOLEAN DEFAULT false,
            data_sharing_enabled BOOLEAN DEFAULT false,
            last_data_sharing_consent_date TIMESTAMPTZ,
            last_data_sharing_revocation_date TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            version INT DEFAULT 1
        );

        -- Role-specific profile tables with public/private data separation
        CREATE TABLE IF NOT EXISTS private.admin_profile (
            user_id UUID PRIMARY KEY REFERENCES private.user(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS private.clinician_profile (
            user_id UUID PRIMARY KEY REFERENCES private.user(id) ON DELETE CASCADE,
            -- Public information (visible to admin and associated patients)
            ahprah_registration_number TEXT NOT NULL,
            specialisation TEXT,
            practice_name TEXT,
            -- Private information (visible only to admin)
            private_data JSONB,
            business_address TEXT,
            abn TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS private.patient_profile (
            user_id UUID PRIMARY KEY REFERENCES private.user(id) ON DELETE CASCADE,
            -- Private information (visible only to admin)
            private_data JSONB,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS private.user_invitation (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT NOT NULL,
            phone_number TEXT,
            user_id UUID REFERENCES private.user(id) ON DELETE CASCADE,
            invitation_token TEXT NOT NULL UNIQUE,
            invited_by UUID REFERENCES private.user(id),
            role_id UUID REFERENCES private.role(id) NOT NULL,
            registration_type TEXT NOT NULL DEFAULT 'partial', -- 'partial' or 'full'
            expires_at TIMESTAMPTZ NOT NULL,
            status TEXT DEFAULT 'pending', -- pending, completed, expired
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- Clinician-Patient relationship table
        CREATE TABLE IF NOT EXISTS private.clinician_patient_relationship (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            clinician_id UUID REFERENCES private.clinician_profile(user_id) ON DELETE CASCADE,
            patient_id UUID REFERENCES private.patient_profile(user_id) ON DELETE CASCADE,
            status TEXT DEFAULT 'active',
            start_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            end_date TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(clinician_id, patient_id, status)
        );

        -- Medical records with privacy levels
        CREATE TABLE IF NOT EXISTS private.medical_record (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            patient_id UUID REFERENCES private.patient_profile(user_id),
            clinician_id UUID REFERENCES private.clinician_profile(user_id),
            record_type VARCHAR(100) NOT NULL,
            -- Metadata (visible to admin)
            metadata JSONB NOT NULL,
            -- Health data (visible only to patient and assigned clinician)
            data JSONB NOT NULL,
            privacy_level TEXT DEFAULT 'standard',
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

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
            id SERIAL PRIMARY KEY,
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

        DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_role_id') THEN
                CREATE INDEX idx_users_role_id ON private.user(role_id);
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_medical_records_patient_id') THEN
                CREATE INDEX idx_medical_records_patient_id ON private.medical_record(patient_id);
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_medical_records_clinician_id') THEN
                CREATE INDEX idx_medical_records_clinician_id ON private.medical_record(clinician_id);
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_clinician_patient_active') THEN
                CREATE INDEX idx_clinician_patient_active ON private.clinician_patient_relationship(clinician_id, patient_id) 
                WHERE status = 'active';
            END IF;
        END $$;
    `)


    await db.query(`
        INSERT INTO private.role (name, description)
        SELECT 'admin', 'System administrator with full access'
        WHERE NOT EXISTS (SELECT 1 FROM private.role WHERE name = 'admin');

        INSERT INTO private.role (name, description)
        SELECT 'clinician', 'Healthcare provider with patient care access'
        WHERE NOT EXISTS (SELECT 1 FROM private.role WHERE name = 'clinician');

        INSERT INTO private.role (name, description)
        SELECT 'patient', 'Patient with limited access to own records'
        WHERE NOT EXISTS (SELECT 1 FROM private.role WHERE name = 'patient');

        -- Insert permissions if they don't exist
        INSERT INTO private.permission (name, resource_type, action, description)
        SELECT name, resource_type, action, description
        FROM (VALUES
            ('manage_users', 'users', 'manage', 'Can manage all user accounts'),
            ('view_user_metadata', 'users', 'view', 'Can view user metadata'),
            ('view_all_records_metadata', 'medical_records', 'view_metadata', 'Can view all medical records metadata'),
            ('view_assigned_records', 'medical_records', 'view', 'Can view medical records of assigned patients'),
            ('manage_own_records', 'medical_records', 'manage', 'Can manage own medical records'),
            ('view_own_records', 'medical_records', 'view', 'Can view own medical records'),
            ('manage_patient_relationships', 'relationships', 'manage', 'Can manage clinician-patient relationships')
        ) AS v(name, resource_type, action, description)
        WHERE NOT EXISTS (SELECT 1 FROM private.permission WHERE name = v.name);

        -- Assign permissions to roles if they don't exist
        INSERT INTO private.role_permission (role_id, permission_id)
        SELECT r.id, p.id 
        FROM private.role r, private.permission p 
        WHERE r.name = 'admin' 
        AND p.name IN (
            'manage_users',
            'view_user_metadata',
            'view_all_records_metadata',
            'manage_patient_relationships'
        )
        AND NOT EXISTS (
            SELECT 1 FROM private.role_permission
            WHERE role_id = r.id AND permission_id = p.id
        );

        INSERT INTO private.role_permission (role_id, permission_id)
        SELECT r.id, p.id 
        FROM private.role r, private.permission p 
        WHERE r.name = 'clinician' 
        AND p.name IN (
            'view_assigned_records',
            'manage_own_records'
        )
        AND NOT EXISTS (
            SELECT 1 FROM private.role_permission
            WHERE role_id = r.id AND permission_id = p.id
        );

        INSERT INTO private.role_permission (role_id, permission_id)
        SELECT r.id, p.id 
        FROM private.role r, private.permission p 
        WHERE r.name = 'patient' 
        AND p.name = 'view_own_records'
        AND NOT EXISTS (
            SELECT 1 FROM private.role_permission 
            WHERE role_id = r.id AND permission_id = p.id
        );

        -- Create or replace view for clinician's patients
        CREATE OR REPLACE VIEW private.clinician_patient AS
        SELECT 
            c.user_id as clinician_id,
            p.user_id as patient_id,
            u.email as patient_email,
            cpr.start_date as relationship_start_date,
            cpr.status as relationship_status
        FROM private.clinician_patient_relationship cpr
        JOIN private.patient_profile p ON cpr.patient_id = p.user_id
        JOIN private.user u ON p.user_id = u.id
        JOIN private.clinician_profile c ON cpr.clinician_id = c.user_id
        WHERE cpr.status = 'active';

        -- Grant appropriate permissions to application role
        DO $$ 
        BEGIN
            -- Create application role if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
                CREATE ROLE app_user;
            END IF;
            
            -- Grant permissions
            GRANT USAGE ON SCHEMA private TO app_user;
            GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA private TO app_user;
        END $$;
    `)

    console.log('DatabaseService: Tables created');
}