import { z } from 'zod';

export const MedicationReasonSchema = z.enum([
    'pain'
])

const VALID_DOSE_UNITS = ['mg', 'g', 'mcg', 'mL', 'L', 'IU', 'mEq'] as const;

const DoseUnitSchema = z.enum(VALID_DOSE_UNITS);

const FrequencySchema = z.number();

const DosageSchema = z.object({
    original: z.string().refine(
        (val) => {
            const hasInvalidChars = /[^a-zA-Z0-9\s.]/g.test(val);
            if (hasInvalidChars) return false;

            return true
        },
        {
            message: "Please enter a valid dosage (e.g., '0.5mg', '500mg', '10mL')",
        }
    ),
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

    frequency: FrequencySchema,

    reason: MedicationReasonSchema,
    notes: z.string().optional(),
});

export const DBEncryptedMedicationDataV1PartialSchema = DBEncryptedMedicationDataV1Schema.partial();

export const DBEncryptedMedicationV1Schema = z.object({
    version: z.literal(1),
    data: DBEncryptedMedicationDataV1Schema,
}).strict();



export const CreateEncryptedPainMedicationDataV1RequestSchema = DBEncryptedMedicationDataV1Schema.pick({
    start_date: true,
    end_date: true,
    is_on_going: true,
    medication_name: true,
    dosage: true,
    frequency: true,
    reason: true,
}).extend({
    start_date: z.coerce.date(),
    end_date: z.coerce.date().nullable().optional(),
    reason: z.literal('pain'),
})
export function validateCreateEncryptedPainMedicationDataV1Request(data: unknown): z.infer<typeof CreateEncryptedPainMedicationDataV1RequestSchema> {
    const parsedResult = CreateEncryptedPainMedicationDataV1RequestSchema.safeParse(data);
    if (!parsedResult.success) {
        throw parsedResult.error;
    }
    return parsedResult.data;
}
export function validateCreateEncryptedPainMedicationDataV1Requests(data: unknown[]): z.infer<typeof CreateEncryptedPainMedicationDataV1RequestSchema>[] {
    const parsedResult = z.array(CreateEncryptedPainMedicationDataV1RequestSchema).safeParse(data);
    if (!parsedResult.success) {
        throw parsedResult.error;
    }
    return parsedResult.data;
}

export const CreateEncryptedPainMedicationDataV1RequestPartialSchema = CreateEncryptedPainMedicationDataV1RequestSchema.partial().extend({
    reason: z.literal('pain').optional().default('pain'),
    is_on_going: z.boolean().optional().default(true),
});
export function validateCreateEncryptedPainMedicationDataV1RequestPartial(data: unknown): z.infer<typeof CreateEncryptedPainMedicationDataV1RequestPartialSchema> {
    const parsedResult = CreateEncryptedPainMedicationDataV1RequestPartialSchema.safeParse(data);
    if (!parsedResult.success) {
        throw parsedResult.error;
    }
    return parsedResult.data;
}
export function validateCreateEncryptedPainMedicationDataV1RequestsPartial(data: unknown): z.infer<typeof CreateEncryptedPainMedicationDataV1RequestPartialSchema>[] {
    const parsedResult = z.array(CreateEncryptedPainMedicationDataV1RequestPartialSchema).safeParse(data);
    if (!parsedResult.success) {
        console.log(parsedResult.error);
        throw parsedResult.error;
    }
    return parsedResult.data;
}