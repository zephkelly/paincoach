import { DatabaseService } from "~~/server/services/databaseService";



export async function createDailyPainRecordTable(db: DatabaseService) {
    await db.query(`
        CREATE SCHEMA IF NOT EXISTS record;

        -- Create the daily_record_pain table within the record schema
        CREATE TABLE IF NOT EXISTS record.daily_record_pain (
            -- Primary key using UUID v7 for time ordering
            id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
            
            -- Core record data
            date DATE NOT NULL,
            user_id UUID NOT NULL REFERENCES private.user(id) ON DELETE CASCADE,
            
            -- Pain data
            pain_level INTEGER NOT NULL CHECK (pain_level >= 0 AND pain_level <= 10),
            
            -- Psychological data
            mood_level INTEGER NOT NULL CHECK (mood_level >= 1 AND mood_level <= 5),
            stress_level INTEGER NOT NULL CHECK (stress_level >= 1 AND stress_level <= 5),
            anxiety_level INTEGER NOT NULL CHECK (anxiety_level >= 1 AND anxiety_level <= 5),
            
            -- Sleep data
            sleep_duration NUMERIC(4,2) NOT NULL CHECK (sleep_duration >= 0 AND sleep_duration <= 24),
            sleep_quality INTEGER NOT NULL CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
            sleep_wake_ups TEXT NOT NULL CHECK (sleep_wake_ups ~ '^([0-9]|10\+)$'),
            
            -- Nutrition data
            plant_intake_level INTEGER NOT NULL CHECK (plant_intake_level >= 1 AND plant_intake_level <= 5),
            whole_food_intake_level INTEGER NOT NULL CHECK (whole_food_intake_level >= 1 AND whole_food_intake_level <= 5),
            sugar_intake_level INTEGER NOT NULL CHECK (sugar_intake_level >= 1 AND sugar_intake_level <= 5),
            
            -- Exercise data
            exercise_duration TEXT NOT NULL CHECK (exercise_duration IN ('0', '1-10', '11-20', '21-30', '31+')),
            exercise_intensity INTEGER NOT NULL CHECK (exercise_intensity >= 1 AND exercise_intensity <= 5),
            exercise_safety INTEGER NOT NULL CHECK (exercise_safety >= 1 AND exercise_safety <= 5),
            
            -- Social data
            social_quality INTEGER NOT NULL CHECK (social_quality >= 1 AND social_quality <= 5),
            social_belonging INTEGER NOT NULL CHECK (social_belonging >= 1 AND social_belonging <= 5),
            
            -- User notes
            notes TEXT CHECK (LENGTH(notes) <= 500),
            
            -- Metadata
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            version INTEGER DEFAULT 1
        );

        -- Create index for user_id for faster lookups
        CREATE INDEX IF NOT EXISTS idx_daily_record_pain_user_id ON record.daily_record_pain(user_id);

        -- Create index for date for faster lookups by date
        CREATE INDEX IF NOT EXISTS idx_daily_record_pain_date ON record.daily_record_pain(date);

        -- Create composite index for user_id and date for common queries
        CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_record_pain_user_date ON record.daily_record_pain(user_id, date);

        -- Add a function to automatically update the updated_at timestamp
        CREATE OR REPLACE FUNCTION record.update_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        CREATE OR REPLACE VIEW record.last_30_days_daily_record_pain AS
        SELECT
            user_id,
            date,
            created_at,
            updated_at,
            version,

            pain_level,

            mood_level,
            stress_level,
            anxiety_level,

            sleep_duration,
            sleep_quality,
            sleep_wake_ups,

            plant_intake_level,
            whole_food_intake_level,
            sugar_intake_level,

            exercise_duration,
            exercise_intensity,
            exercise_safety,

            social_quality,
            social_belonging,

            notes
        FROM record.daily_record_pain
        WHERE date >= CURRENT_DATE - INTERVAL '30 days'
        AND date <= CURRENT_DATE
        ORDER BY date DESC;
    `)
}
    // -- Create a trigger to call the function before update
    // CREATE TRIGGER trigger_update_daily_record_pain_timestamp
    // BEFORE UPDATE ON record.daily_record_pain
    // FOR EACH ROW
    // EXECUTE FUNCTION record.update_timestamp();
    
    // 
    
    