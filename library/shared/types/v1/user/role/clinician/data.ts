import { z } from 'zod';

import { DBClinicianUserDataSchema } from '@@/shared/schemas/v1/user/role/clinician/data';



export type DBClinicianUserData = z.infer<typeof DBClinicianUserDataSchema>;