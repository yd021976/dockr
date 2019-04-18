import { DataModelPropertyEntities } from "./datamodel.model";
/**
 * 
 */
export enum ALLOWED_STATES {
    ALLOWED = "1",
    FORBIDDEN = "0",
    INDETERMINATE = "indeterminate"
}
/**
 * Define CRUD operation & fields access
 */
export enum CRUD_OPERATIONS {
    CREATE = 'create',
    UPDATE = 'update',
    READ = "read",
    DELETE = "delete"
}
export type CrudOperationTypes = CRUD_OPERATIONS

interface BaseCrudOperationModel {
    uid?: string
    id: CrudOperationTypes
    allowed?: ALLOWED_STATES // set to true (allowed), false (not allowed) or "intermediate" (Some child fields are allowed but not all)
}

// Crud operation object
export interface CrudOperationModel extends BaseCrudOperationModel {
    fields: DataModelPropertyEntities
}
// Crud operation entity
export interface CrudOperationModelEntity extends BaseCrudOperationModel {
    fields: string[] // Array of fields UUID
}

// List of crud operations entities
export interface CrudOperationsModelEntities {
    [id: string]: CrudOperationModelEntity
}

export interface CrudOperationsStateModel {
    entities: CrudOperationsModelEntities;
    isLoading: boolean;
    isError: boolean;
    error: string;
}