import { AclServicesEntities, AclServiceModel } from "./acl.services.model";

/**
 * Base role model
 */
export interface BaseAclRoleModel {
    uid?: string // UUID for local storage
    _id: string;
    name: string;
}

// Role object
export interface AclRoleModel extends BaseAclRoleModel {
    services: AclServiceModel[]
}

/**
 * Interface for role selection
 */
export interface AclRoleModelSelection extends BaseAclRoleModel {
    selected: boolean
}
// Role entity
export interface AclRoleEntity extends BaseAclRoleModel {
    services: string[]
}
/**
 * Roles entities
 */
export interface AclRoleEntities {
    [ id: string ]: AclRoleEntity;
}

export interface AclRolesStateModel {
    entities: AclRoleEntities;
    isLoading: boolean;
    isError: boolean;
    error: string;
} 