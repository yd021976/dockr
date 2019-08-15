import { AclServiceActionModel } from "./acl.service.action.model";

/**
 * Backend service definition
 */
interface BaseAclServiceModel {
    uid?:string // UUID
    id: string;
    name: string;
    description: string;
}
export interface AclServiceModel extends BaseAclServiceModel {
    crud_operations: AclServiceActionModel[]
}
export interface AclServiceEntity extends BaseAclServiceModel {
    crud_operations: string[]
}
/**
 * list of backend services entities
 */
export interface AclServicesEntities {
    [id: string]: AclServiceEntity
}

export interface BackendServicesStateModel {
    entities: AclServicesEntities;
    isLoading: boolean;
    isError: boolean;
    error: string;
}