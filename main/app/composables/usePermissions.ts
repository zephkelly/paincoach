import { PERMISSIONS, validatePermissions } from '@@/shared/schemas/v1/permission';
import type { Permission } from '@@/shared/types/v1/permission';



const globalPermissionsKey = 'global-user-permissions';

export function usePermissions() {
    const { data: permissionsArray, status, error, refresh } = useAsyncData(
        globalPermissionsKey,
        async () => {
            try {
                const { data } = await useFetch('/api/v1/auth/permissions');
                return data.value || [];
            }
            catch (err) {
                console.error('Failed to fetch permissions:', err);
                return [];
            }
        },
        {
            server: true,
            lazy: false,
            immediate: true,
            transform: (data) => data,
            watch: []
        }
    );

    const permissionsMap = computed(() => {
        const map: Record<string, boolean> = {};
        if (permissionsArray.value) {
            permissionsArray.value.forEach(permission => {
                map[permission] = true;
            });
        }
        return map;
    });

    const hasPermission = (permission: Permission): boolean => {
        return !!permissionsMap.value[permission];
    };

    const hasAnyPermission = (permissionList: Permission[]): boolean => {
        return permissionList.some(permission => hasPermission(permission));
    };

    const hasAllPermissions = (permissionList: Permission[]): boolean => {
        return permissionList.every(permission => hasPermission(permission));
    };


    return {
        permissions: permissionsArray,
        permissionsMap,
        isLoading: status.value === 'pending',
        error,
        refresh,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        PERMISSIONS
    };
}