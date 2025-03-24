import { z } from 'zod';

import {
    DBClinicianUserSchema,
    DBClinicianUserWithRolesSchema,

    ClinicianUserSchema,
    ClinicianUserWithRolesSchema
} from '@@/shared/schemas/v1/user/role/clinician';



export type DBClinicianUser = z.infer<typeof DBClinicianUserSchema>;
export type DBClinicianUserWithRoles = z.infer<typeof DBClinicianUserWithRolesSchema>;

export type ClinicianUser = z.infer<typeof ClinicianUserSchema>;
export type ClinicianUserWithRoles = z.infer<typeof ClinicianUserWithRolesSchema>;