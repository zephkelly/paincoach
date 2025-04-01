import { z } from 'zod';



export const DBClinicianSpecialisations = z.enum([
    'physiotherapy',
]);


export const DBClinicianUserDataSchema = z.object({    
    ahpra_registration_number: z.string()
    .trim()
    .regex(
      /^(?:PSY|psy)\d{8,10}$/,
      "Invalid AHPRA number format. It must start with 'PSY' followed by 8-10 digits (e.g., PSY00000001)."
    )
    .transform((val) => val.toUpperCase()),

    specialisation: DBClinicianSpecialisations.default('physiotherapy'),
});