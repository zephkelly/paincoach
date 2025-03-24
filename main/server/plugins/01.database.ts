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
            role_invite_data JSONB,
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

    // await db.query(`

    //     CREATE TABLE IF NOT EXISTS private.user_role (
    //         user_id UUID REFERENCES private.user(id) ON DELETE CASCADE,
    //         role_id UUID REFERENCES private.role(id) ON DELETE CASCADE,
    //         is_primary BOOLEAN DEFAULT false,
    //         created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    //         updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    //         PRIMARY KEY (user_id, role_id)
    //     );

    //     CREATE TABLE IF NOT EXISTS private.permission (
    //         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    //         name TEXT NOT NULL UNIQUE,
    //         description TEXT,
    //         resource_type TEXT NOT NULL,
    //         action TEXT NOT NULL,
    //         created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    //         updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    //     );

    //     CREATE TABLE IF NOT EXISTS private.role_permission (
    //         role_id UUID REFERENCES private.role(id) ON DELETE CASCADE,
    //         permission_id UUID REFERENCES private.permission(id) ON DELETE CASCADE,
    //         created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    //         PRIMARY KEY (role_id, permission_id)
    //     );

    //     -- Base users table
    //     CREATE TABLE IF NOT EXISTS private.user (
    //         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    //         email TEXT NOT NULL UNIQUE,
    //         last_email_bounced_date TIMESTAMPTZ,
    //         verified BOOLEAN DEFAULT false,
    //         phone_number TEXT UNIQUE,
    //         title TEXT DEFAULT NULL,
    //         first_name TEXT NOT NULL,
    //         last_name TEXT,
    //         profile_url TEXT,
    //         password_hash TEXT,
    //         primary_role TEXT REFERENCES private.role(name) NOT NULL,
    //         status TEXT DEFAULT 'pending',
    //         registration_complete BOOLEAN DEFAULT false,
    //         data_sharing_enabled BOOLEAN DEFAULT false,
    //         last_data_sharing_consent_date TIMESTAMPTZ,
    //         last_data_sharing_revocation_date TIMESTAMPTZ,
    //         created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    //         updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    //         version INT DEFAULT 1
    //     );

    //     -- Role-specific profile tables with public/private data separation
    //     CREATE TABLE IF NOT EXISTS private.admin_profile (
    //         user_id UUID PRIMARY KEY REFERENCES private.user(id) ON DELETE CASCADE,
    //         created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    //         updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    //     );

    //     CREATE TABLE IF NOT EXISTS private.clinician_profile (
    //         user_id UUID PRIMARY KEY REFERENCES private.user(id) ON DELETE CASCADE,
    //         -- Public information (visible to admin and associated patients)
    //         ahprah_registration_number TEXT NOT NULL,
    //         specialisation TEXT,
    //         practice_name TEXT,
    //         -- Private information (visible only to admin)
    //         private_data JSONB,
    //         business_address TEXT,
    //         abn TEXT,
    //         created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    //         updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    //     );

    //     CREATE TABLE IF NOT EXISTS private.user_invitation (
    //         id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    //         email TEXT NOT NULL,
    //         phone_number TEXT,
    //         user_id UUID NOT NULL,
    //         linked_user_id UUID REFERENCES private.user(id) DEFAULT NULL, 
    //         invitation_token TEXT NOT NULL UNIQUE,
    //         invited_by UUID REFERENCES private.user(id) NOT NULL,
    //         role_id UUID REFERENCES private.role(id) NOT NULL,
    //         registration_type TEXT NOT NULL DEFAULT 'partial', -- 'partial' or 'full'
    //         registration_data JSONB,
    //         expires_at TIMESTAMPTZ NOT NULL,
    //         status TEXT DEFAULT 'pending', -- pending, opened, completed, expired
    //         created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    //         updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    //     );

    //     -- Clinician-Patient relationship table
    //     CREATE TABLE IF NOT EXISTS private.clinician_patient_relationship (
    //         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    //         clinician_id UUID REFERENCES private.clinician_profile(user_id) ON DELETE CASCADE,
    //         patient_id UUID REFERENCES private.patient_profile(user_id) ON DELETE CASCADE,
    //         status TEXT DEFAULT 'active',
    //         start_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    //         end_date TIMESTAMPTZ,
    //         created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    //         updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    //         UNIQUE(clinician_id, patient_id, status)
    //     );

    //     CREATE TABLE IF NOT EXISTS private.email_feedback (
    //         feedback_id SERIAL PRIMARY KEY,
    //         email TEXT NOT NULL,
    //         feedback_type TEXT NOT NULL,
    //         sub_type TEXT NOT NULL,
    //         timestamp TIMESTAMP NOT NULL,
    //         diagnostic TEXT,
            
    //         CONSTRAINT fk_email
    //             FOREIGN KEY (email)
    //             REFERENCES private.user(email)
    //             ON DELETE CASCADE
    //     );

    //     CREATE TABLE IF NOT EXISTS private.mailing_list_subscription (
    //         id SERIAL PRIMARY KEY,
    //         email TEXT NOT NULL UNIQUE,
    //         name TEXT,
    //         subscription_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    //         unsubscription_date TIMESTAMPTZ,
    //         is_active BOOLEAN DEFAULT TRUE,
    //         unsubscribe_token TEXT UNIQUE,
    //         source TEXT,
    //         user_id UUID REFERENCES private.user(id) ON DELETE SET NULL,
    //         created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    //         updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    //     );
    // `)

    // await db.query(`
    //     CREATE TABLE IF NOT EXISTS private.patient_profile (
    //         user_id UUID PRIMARY KEY REFERENCES private.user(id) ON DELETE CASCADE,
    //         -- Private information (visible only to admin)
    //         private_data JSONB,
    //         created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    //         updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    //     );

    //     CREATE TABLE IF NOT EXISTS private.patient_medication (
    //         id BIGSERIAL PRIMARY KEY,
    //         patient_id UUID REFERENCES private.patient_profile(user_id) ON DELETE CASCADE,
    //         clinician_id UUID REFERENCES private.clinician_profile(user_id),
            
    //         encrypted_medication_data JSONB NOT NULL,
            
    //         -- Tracking
    //         created_by UUID REFERENCES private.user(id) NOT NULL,
    //         updated_by UUID REFERENCES private.user(id),
    //         created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    //         updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    //     );

    //     -- Medical records with privacy levels
    //     CREATE TABLE IF NOT EXISTS private.medical_record (
    //         id BIGSERIAL PRIMARY KEY,
    //         patient_id UUID REFERENCES private.patient_profile(user_id),
    //         clinician_id UUID REFERENCES private.clinician_profile(user_id),

    //         record_practice_type TEXT NOT NULL, -- 'physiotherapy', 'psychology', etc.
    //         record_type TEXT NOT NULL, -- 'app_record', etc.

    //         -- Health data (visible only to patient and assigned clinician)
    //         encrypted_data JSONB NOT NULL,

    //         created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    //         updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    //     );

    //     ALTER TABLE private.patient_medication ENABLE ROW LEVEL SECURITY;
    // `)


    await db.query(`
        INSERT INTO private.role (name, description)
        SELECT 'owner', 'Site owner with ability to manage all aspects of the site'
        WHERE NOT EXISTS (SELECT 1 FROM private.role WHERE name = 'owner');

        INSERT INTO private.role (name, description)
        SELECT 'admin', 'System administrator with full access'
        WHERE NOT EXISTS (SELECT 1 FROM private.role WHERE name = 'admin');

        INSERT INTO private.role (name, description)
        SELECT 'clinician', 'Healthcare provider with patient care access'
        WHERE NOT EXISTS (SELECT 1 FROM private.role WHERE name = 'clinician');

        INSERT INTO private.role (name, description)
        SELECT 'patient', 'Patient with limited access to own records'
        WHERE NOT EXISTS (SELECT 1 FROM private.role WHERE name = 'patient');
    `);
        //     -- Insert permissions if they don't exist
        //     INSERT INTO private.permission (name, resource_type, action, description)
        //     SELECT name, resource_type, action, description
        //     FROM (VALUES
        //         ('manage_users', 'users', 'manage', 'Can manage all user accounts'),
        //         ('view_user_metadata', 'users', 'view', 'Can view user metadata'),
        //         ('view_all_records_metadata', 'medical_records', 'view_metadata', 'Can view all medical records metadata'),
        //         ('view_assigned_records', 'medical_records', 'view', 'Can view medical records of assigned patients'),
        //         ('manage_own_records', 'medical_records', 'manage', 'Can manage own medical records'),
        //         ('view_own_records', 'medical_records', 'view', 'Can view own medical records'),
        //         ('manage_patient_relationships', 'relationships', 'manage', 'Can manage clinician-patient relationships')
        //     ) AS v(name, resource_type, action, description)
        //     WHERE NOT EXISTS (SELECT 1 FROM private.permission WHERE name = v.name);

    // console.log('DatabaseService: Tables created');
}