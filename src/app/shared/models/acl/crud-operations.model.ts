import { DataModelPropertyEntities } from "./datamodel.model";

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
    allowed?: boolean // Should be set only if <fields> are empty (no field control access required)
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