import { AclServiceActionModel } from "./acl.service.action.model";

/**
 * Backend service definition
 */
interface BaseBackendServiceModel {
    uid?:string // UUID
    id: string;
    name: string;
    description: string;
}
export interface BackendServiceModel extends BaseBackendServiceModel {
    operations: AclServiceActionModel[]
}
export interface AclServiceEntity extends BaseBackendServiceModel {
    operations: string[]
}
/**
 * list of backend services entities
 */
export interface BackendServicesEntities {
    [id: string]: AclServiceEntity
}

export interface BackendServicesStateModel {
    entities: BackendServicesEntities;
    isLoading: boolean;
    isError: boolean;
    error: string;
}