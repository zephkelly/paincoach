import { onRequestValidateSession } from "~~/server/utils/auth/request-middleware/validate-session";



export default defineCachedEventHandler(async (event) => {
    try {
        await onRequestValidateSession(event);

        const { secureSession } = await getPainCoachSession(event);
        
        if (!secureSession || !secureSession.user_id) {
          throw createError({
            statusCode: 401,
            message: 'Unauthorized',
          });
        }
        
        // Use the cached function
        const permissions = await getUserPermissions(secureSession.user_id);
        
        return permissions;

    }
    catch (error: unknown) {
        console.error('Error getting permissions', error);
        throw createError({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
  }, {
    maxAge: 3600, // 1 hour
    // Cache per user
    getKey: (event) => {
      const session = event.context.session;
      return `user-${session?.user?.id || 'anonymous'}`;
    },
    // Only vary the cache by user session, not other headers
    varies: ['cookie'],
});