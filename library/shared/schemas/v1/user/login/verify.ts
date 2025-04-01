// Used for login verification
import { createSchemaValidator } from '@@/shared/utils/zod/new';
import { DBBaseUserWithRolesSchema } from '../base';



export const UserLoginVerificationDataSchema = DBBaseUserWithRolesSchema.pick({
    id: true,
    public_id: true,
    email: true,
    password_hash: true,
    first_name: true,
    verified: true,
    profile_url: true,
    primary_role: true,
    roles: true,
});

export const userLoginVerificationDataValidator = createSchemaValidator(UserLoginVerificationDataSchema);