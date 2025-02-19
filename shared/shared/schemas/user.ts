import { z } from 'zod';



const UserRole = z.enum(['admin', 'clinician', 'patient'])
const AccountStatus = z.enum(['active', 'inactive', 'pending'])

const PHONE_PATTERN = /^\+?[1-9]\d{1,14}$/


export const SserSchema = z.object({
    id: z.string().uuid(),
    
    email: z.string()
        .email('Invalid email format')
        .max(255, 'Email must be less than 255 characters'),
    
    phone_number: z.string()
        .regex(PHONE_PATTERN, 'Invalid phone number format')
        .max(50, 'Phone number must be less than 50 characters')
        .nullable(),
    
    password_hash: z.string()
        .min(1, 'Password hash is required')
        .max(255, 'Password hash must be less than 255 characters'),
    
    role: UserRole,
    
    status: AccountStatus.default('pending'),
    
    data_sharing_enabled: z.boolean().default(false),
    
    last_data_sharing_consent_date: z.date()
        .nullable()
        .refine((date) => {
            if (date) {
                return date <= new Date()
            }
            return true
        }, 'Consent date cannot be in the future'),
    
    last_data_sharing_revocation_date: z.date()
        .nullable()
        .refine((date) => {
        if (date) {
            return date <= new Date()
        }
        return true
        }, 'Revocation date cannot be in the future'),
    
    created_at: z.date().default(() => new Date()),
    
    updated_at: z.date().default(() => new Date())
    })
    .refine(
        (data) => {
            if (data.last_data_sharing_revocation_date && !data.last_data_sharing_consent_date) {
                return false
            }

            if (data.last_data_sharing_revocation_date && data.last_data_sharing_consent_date) {
                return data.last_data_sharing_revocation_date > data.last_data_sharing_consent_date
            }

            return true
        },
        {
            message: 'Invalid data sharing dates: Revocation date must be after consent date and consent date is required for revocation'
        }
    )
    .refine(
        (data) => {
            if (data.last_data_sharing_revocation_date && data.data_sharing_enabled) {
                return false
            }
            return true
        },
        {
            message: 'Data sharing cannot be enabled if there is a revocation date'
        }
    )



// CREATE TABLE users (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     email VARCHAR(255) UNIQUE NOT NULL,
//     phone_number VARCHAR(50),
//     password_hash VARCHAR(255) NOT NULL,
//     role user_role NOT NULL,
//     status account_status DEFAULT 'pending',
//     data_sharing_enabled BOOLEAN DEFAULT FALSE,
//     last_data_sharing_consent_date TIMESTAMP WITH TIME ZONE,
//     data_sharing_revocation_date TIMESTAMP WITH TIME ZONE,
//     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
// );