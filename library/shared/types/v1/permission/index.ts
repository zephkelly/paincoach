import { z } from 'zod';
import { PERMISSIONS, PermissionSchema } from '@@/shared/schemas/v1/permission';


type ExtractPermissionValues<T> = T extends string ? T : T extends object ? ExtractPermissionValues<T[keyof T]> : never;
export type Permission = ExtractPermissionValues<typeof PERMISSIONS>;