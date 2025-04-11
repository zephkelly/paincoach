import type { H3Event } from 'h3';

import type { Permission } from "@@/shared/types/v1/permission";
import { getCachedPermissions } from "./functions/getPermissions";



export class PermissionRepository {
    public static async getPermissions(event: H3Event, userId: string): Promise<Permission[]> {
        return await getCachedPermissions(event, userId);
    }
}
