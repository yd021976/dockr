/**
 * Service data model declaration
 */
export interface dataModelProperty {
    type: string;
    allowed: boolean;
    children?: dataModel
}

export interface dataModel {
    [property: string]: dataModelProperty;
}



/**
 * Define CRUD operation & field access
 */
export enum CRUD_OPERATIONS {
    CREATE = 'create',
    UPDATE = 'update',
    READ = "read",
    DELETE = "delete"
}
export type CrudOperation = CRUD_OPERATIONS
export interface CrudOperationModel {
    operation: CrudOperation
    fields: dataModel
}
export interface CrudOperationsModel {
    [id: string]: CrudOperationModel
}



/**
 * Backend service definition
 */
export interface BackendServiceModel {
    id: string;
    name: string;
    description: string;
    crud_operations: CrudOperationsModel
}

/**
 * list of backend services
 */
export interface BackendServicesModel {
    [id: string]: BackendServiceModel
}