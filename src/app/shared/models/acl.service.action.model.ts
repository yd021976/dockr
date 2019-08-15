import { ServiceFieldEntities, ServiceFieldModel } from "./acl.service.field.model";
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
export enum ACL_SERVICES_ACTIONS {
    CREATE = 'create',
    UPDATE = 'update',
    READ = "read",
    DELETE = "delete"
}
export type AclServiceActionsTypes = ACL_SERVICES_ACTIONS

interface BaseAclServiceActionModel {
    uid?: string
    id: AclServiceActionsTypes
    allowed?: ALLOWED_STATES // set to true (allowed), false (not allowed) or "intermediate" (Some child fields are allowed but not all)
}

// Crud operation object
export interface AclServiceActionModel extends BaseAclServiceActionModel {
    fields: ServiceFieldModel[]
}
// Crud operation entity
export interface AclServiceActionModelEntity extends BaseAclServiceActionModel {
    fields: string[] // Array of fields UUID
}

// List of crud operations entities
export interface AclServiceActionModelEntities {
    [id: string]: AclServiceActionModelEntity
}

export interface CrudOperationsStateModel {
    entities: AclServiceActionModelEntities;
    isLoading: boolean;
    isError: boolean;
    error: string;
}