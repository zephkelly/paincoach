import type { Permission } from "@@/shared/schemas/v1/permission";



export const hasPermission = (permissions: Permission[], requiredPermissions: Permission[] | Permission, requireAll: boolean = false): boolean => {
    if (!permissions || permissions.length === 0) {
        return false;
    }
    const permissionsToCheck = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    if (requireAll) {
        return permissionsToCheck.every(permission => permissions.includes(permission));
    } else {
        return permissionsToCheck.some(permission => permissions.includes(permission));
    }
};