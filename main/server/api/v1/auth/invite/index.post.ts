import { z } from 'zod';
import { onRequestAdminOrClinician } from '~~/server/utils/auth/request-middleware/admin-clinician';
import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/verify-session';

import { getSession } from '~~/server/utils/auth/session/getSession';

const InviteUserRequest = z.object({

})


export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event),
        (event) => onRequestAdminOrClinician(event),
    ],
    handler: async (event) => {
        const {
            session,
            userSession,
            secureSession
        } = await getSession(event);


    }
})