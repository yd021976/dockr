import { CrudOperationsModelEntities, CrudOperationModel } from "./crud-operations.model";

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
    crud_operations: CrudOperationModel[]
}
export interface BackendServiceEntity extends BaseBackendServiceModel {
    crud_operations: string[]
}
/**
 * list of backend services entities
 */
export interface BackendServicesEntities {
    [id: string]: BackendServiceEntity
}

export interface BackendServicesStateModel {
    entities: BackendServicesEntities;
    isLoading: boolean;
    isError: boolean;
    error: string;
}