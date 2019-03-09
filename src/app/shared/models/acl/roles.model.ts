import { BackendServicesEntities, BackendServiceModel } from "./backend-services.model";

/**
 * Base role model
 */
interface baseRoleModel {
    uid?: string // UUID
    id: string;
    name: string;
}

// Role object
export interface RoleModel extends baseRoleModel {
    services: BackendServiceModel[]
}

// Role entity
export interface RoleEntity extends baseRoleModel {
    services: string[]
}
/**
 * Roles entities
 */
export interface RoleEntities {
    [id: string]: RoleEntity;
}

export interface RolesStateModel {
    entities: RoleEntities;
    isLoading: boolean;
    isError: boolean;
    error: string;
} 