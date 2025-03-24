import { z } from 'zod';

export const MedicationReasonSchema = z.enum([
    'pain'
])

const VALID_DOSE_UNITS = ['mg', 'g', 'mcg', 'mL', 'L', 'IU', 'mEq'] as const;

const FREQUENCY_MAP = {
  '4': 'every 4 hours',
  '6': 'every 6 hours',
  '8': 'every 8 hours', 
  '12': 'every 12 hours',
  '24': 'once daily',
  '168': 'once weekly',
  
  // Special cases
  '24-am': 'every morning',
  '24-pm': 'every evening',
  '24-night': 'every night',
  '12-twice': 'twice daily',
  '8-three': 'three times daily',
  '6-four': 'four times daily',
  'meals': 'with meals',
  'prn': 'as needed'
} as const;

const DoseUnitSchema = z.enum(VALID_DOSE_UNITS);

const FrequencyKeySchema = z.enum(Object.keys(FREQUENCY_MAP) as [keyof typeof FREQUENCY_MAP, ...Array<keyof typeof FREQUENCY_MAP>]);

const FrequencySchema = z.object({
    key: FrequencyKeySchema,
    display: z.string().optional(),
}).transform(data => ({
    ...data,
    display: FREQUENCY_MAP[data.key]
}));

const DosageSchema = z.object({
    original: z.string(),
    normalized: z.string().optional(),
    value: z.number().optional(),
    unit: DoseUnitSchema.optional(),
}).transform(data => {
    const normalized = data.original.replace(/^(\d+(?:\.\d+)?)\s+(mg|g|mcg|mL|L|IU|mEq)$/i, '$1$2');
    const match = normalized.match(/^(\d+(?:\.\d+)?)(mg|g|mcg|mL|L|IU|mEq)$/i);
    let value: number | undefined = undefined;
    let unit: z.infer<typeof DoseUnitSchema> | undefined = undefined;
    
    if (match && match[1] && match[2]) {
        value = parseFloat(match[1]);

        unit = DoseUnitSchema.parse(match[2]);
    }
    
    return {
        original: data.original,
        normalized,
        value,
        unit,
    };
}).refine(
    data => {
        return data.value !== undefined && data.unit !== undefined;
    },
    {
        message: "Dosage must be a number followed by a valid unit (e.g., '0.5mg', '500mg', '10mL')",
        path: ["original"]
    }
);

export const DBEncryptedMedicationDataV1Schema = z.object({
    start_date: z.date(),
    end_date: z.date().nullable().optional(),
    is_on_going: z.boolean(),
 
    medication_name: z.string().min(2, "Medication name must be at least 2 characters"),
  
    dosage: z.union([
        z.string().transform(str => DosageSchema.parse({ original: str })),
        DosageSchema
    ]),
  
    frequency: z.union([
        FrequencyKeySchema.transform(key => FrequencySchema.parse({ key })),
        FrequencySchema
    ]),
  
    reason: MedicationReasonSchema,
    notes: z.string().optional(),
});

export const DBEncryptedMedicationDataV1PartialSchema = DBEncryptedMedicationDataV1Schema.partial();

export const DBEncryptedMedicationV1Schema = z.object({
    version: z.literal(1),
    data: DBEncryptedMedicationDataV1Schema,
}).strict();