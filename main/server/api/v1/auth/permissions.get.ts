import { onRequestValidateSession } from "~~/server/utils/auth/request-middleware/validate-session";
import { onRequestValidatePermission } from '~~/server/utils/auth/request-middleware/validate-permission';

import { PERMISSIONS } from '@@/shared/schemas/v1/permission';
import type { Permission } from '@@/shared/types/v1/permission';

export default defineEventHandler({
    onRequest: [
        async (event) => await onRequestValidateSession(event),
        async (event) => await onRequestValidatePermission(event, [
            PERMISSIONS.USER.VIEW.OWN.BASIC,
            PERMISSIONS.USER.VIEW.OWN.LIMITED,
            PERMISSIONS.USER.VIEW.OWN.FULL,
        ]),
    ],
    handler: async (event) => {
        const permissions: Permission[] = event.context.paincoach.user.permissions as Permission[];

        return permissions
    }
});