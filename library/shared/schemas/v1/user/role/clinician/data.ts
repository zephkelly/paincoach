import { z } from 'zod';



export const DBClinicianSpecialisations = z.enum([
    'physiotherapy',
]);


export const DBClinicianUserDataSchema = z.object({    
    ahpra_registration_number: z.string()
        .min(1, 'License number is required')
        .max(100, 'License number must be less than 100 characters'),

    specialisation: DBClinicianSpecialisations.default('physiotherapy'),
});