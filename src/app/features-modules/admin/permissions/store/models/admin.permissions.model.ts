import { THIS_EXPR } from "@angular/compiler/src/output/output_ast"

export type AdminPermissionsEntitiesTypes = AdminPermissionsRoleEntities | AdminPermissionsServiceEntities | AdminPermissionsOperationEntities | AdminPermissionsFieldEntities

export type AdminPermissionsEntityTypes = AdminPermissionsRoleEntity | AdminPermissionsServiceEntity | AdminPermissionsOperationEntity | AdminPermissionsFieldEntity

export type EntityChildren = Array<string>

/**
 * Allowed values for entity allowed property
 */
export enum ALLOWED_STATES {
    ALLOWED = "1",
    FORBIDDEN = "0",
    INDETERMINATE = "indeterminate",
}
export enum ENTITY_TYPES {
    ROLE = "role",
    SERVICE = "service",
    OPERATION = "operation",
    FIELD = "field",
}
/**
 * Action types
 */
export enum EntityActionTypes {
    ADD = "add",
    REMOVE = "remove",
}
/**
 * Extra entity data : Parent entity data
 */
export interface ParentEntity {
    type: string // Parent classname
    uid: string // UID of parent
    entitiesKey: string // Parent state entities key
    childrenKey: string // Parent children property name
}

/**
 * Base entity model
 */
export abstract class AdminPermissionsBaseModel {
    uid?: string
    id: string
    entity_type: ENTITY_TYPES
    name: string
    allowed?: ALLOWED_STATES /** this should be 'null' if entity doesn't support this feature */
    parentEntity: ParentEntity /** Entity's parent data */
    entitiesKey: string /** name of entities collection key this entity is part of */
    children_key: string /** name of the entity children property */
}


/** Role model */
export class AdminPermissionsRoleEntity extends AdminPermissionsBaseModel {
    services: EntityChildren
}

export class AdminPermissionsRoleEntities {
    [uid: string]: AdminPermissionsRoleEntity
}


/** Service model */
export class AdminPermissionsServiceEntity extends AdminPermissionsBaseModel {
    operations: EntityChildren
}
export class AdminPermissionsServiceEntities {
    [uid: string]: AdminPermissionsServiceEntity
}

/** Operations model */
export class AdminPermissionsOperationEntity extends AdminPermissionsBaseModel {
    fields: EntityChildren
}
export class AdminPermissionsOperationEntities {
    [uid: string]: AdminPermissionsOperationEntity
}

/** Fields model */
export class AdminPermissionsFieldEntity extends AdminPermissionsBaseModel {
    fields: EntityChildren
}
export class AdminPermissionsFieldEntities {
    [uid: string]: AdminPermissionsFieldEntity
}


/**
 * State entities format
 */
export class AdminPermissionsStateEntities {
    root_results: EntityChildren
    roles: AdminPermissionsRoleEntities
    services: AdminPermissionsServiceEntities
    operations: AdminPermissionsOperationEntities
    fields: AdminPermissionsFieldEntities
}
/**
 * State model for State
 */
export class AdminPermissionsStateModel {
    entities: AdminPermissionsStateEntities
    previous_entities: AdminPermissionsStateEntities  // Backup entities before update : Usefull to revert entities when error occured
    dirty_entities: AdminPermissionsEntitiesTypes /** Dirty entities collection that have been updated and required backend updates */
}


/**
 * Simple column model for column definition
 */
export interface TreeViewColumnModel {
    colName: string
    size: string
}

/**
 * Column definition for a node of column treeview
 */
export type NodeTreeviewColumnModel = {
    column_model: TreeViewColumnModel[], // The colmun model
    columns_before_node: TreeViewColumnModel[], // columns before the node
    columns_after_node: TreeViewColumnModel[], // columns after the node
    column_size: string,
    node_padding_left: number, // Node indent : Left padding for node level > # of columns in column model property
}

/**
 * Node for column treeview
 */
export class AdminPermissionsFlatNode {
    item: AdminPermissionsEntityTypes
    level: number
    expandable: boolean
}


/**
 * UI State model
 */
export class AdminPermissionsStateUIModel {
    isLoading: boolean /** is an action running */
    isError: boolean /** is an error occured */
    error: string /** error message */
    selected: AdminPermissionsFlatNode /** current treeview selected */
}

