import { Observable } from "rxjs"
import { BackendServiceModel } from "src/app/shared/models/acl.services.model"

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

/**
 * Entity types
 * WARN the strings of each type MUST match storage/state keys
 */
export enum ENTITY_TYPES {
    ROLE = "roles",
    SERVICE = "services",
    OPERATION = "operations",
    FIELD = "fields",
}
/**
 * Action types
 */
export enum EntityActionTypes {
    ADD_ROLE = "add role",
    REMOVE_ROLE = "remove role",
    ADD_SERVICE = "add service",
    REMOVE_SERVICE = "remove service",
}
/**
 * Extra entity data : Parent entity data
 */
export interface AdminPermissionParentEntityMeta {
    type: string // Parent classname
    uid: string // UID of parent
    storage_key: string // Parent state entities key
    children_key: string // Parent children property name
}
export interface AdminPermissionChildrenEntityMeta {
    entity_prop_key: string /** name of the entity children property */
    storage_key: string /**name of children state entities key */
}

/** Base entity data : Should be extended */
export interface EntityBaseModel {
    _id: string
    name: string

    /** optionnal properties */
    uid?: string
    entity_type?: ENTITY_TYPES
    storage_key?: string /** name of entities collection key this entity is part of */
    allowed?: ALLOWED_STATES /** this should be 'null' if entity doesn't support this feature */
    parent_entity_meta?: AdminPermissionParentEntityMeta /** Entity's parent data */
    children_entities_meta?: AdminPermissionChildrenEntityMeta
}
/**
 * Base entity model for state
 */
export abstract class AdminPermissionsStateEntityBaseModel implements EntityBaseModel {
    uid: string
    _id: string /** NeDB unique id */
    entity_type: ENTITY_TYPES
    name: string
    storage_key: string /** name of entities collection key this entity is part of */
    allowed?: ALLOWED_STATES /** this should be 'null' if entity doesn't support this feature */
    parent_entity_meta: AdminPermissionParentEntityMeta /** Entity's parent data */
    children_entities_meta: AdminPermissionChildrenEntityMeta
}
/**
 * Interface for entity creation (either from backend loading or from factory builder)
 */
export interface AdminPermissionsEntityRawData extends EntityBaseModel {
    /** entity possible children */
    services?: EntityChildren | any[]
    operations?: EntityChildren | any[]
    fields?: EntityChildren | any[]
}

/** Role model */
export class AdminPermissionsRoleEntity extends AdminPermissionsStateEntityBaseModel {
    services: EntityChildren | AdminPermissionsServiceEntity[] | BackendServiceModel[]
}

export class AdminPermissionsRoleEntities {
    [uid: string]: AdminPermissionsRoleEntity
}


/** Service model */
export class AdminPermissionsServiceEntity extends AdminPermissionsStateEntityBaseModel {
    operations: EntityChildren | AdminPermissionsOperationEntity[]
}
export class AdminPermissionsServiceEntities {
    [uid: string]: AdminPermissionsServiceEntity
}

/** Operations model */
export class AdminPermissionsOperationEntity extends AdminPermissionsStateEntityBaseModel {
    fields: EntityChildren | AdminPermissionsFieldEntity[]
}
export class AdminPermissionsOperationEntities {
    [uid: string]: AdminPermissionsOperationEntity
}

/** Fields model */
export class AdminPermissionsFieldEntity extends AdminPermissionsStateEntityBaseModel {
    fields: EntityChildren | AdminPermissionsFieldEntity[]
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
export interface AdminPermissionsStateDirtyEntities {
    added: AdminPermissionsEntitiesTypes
    removed: AdminPermissionsEntitiesTypes
    updated: AdminPermissionsEntitiesTypes
}
/**
 * State model for State
 */
export class AdminPermissionsStateModel {
    entities: AdminPermissionsStateEntities
    previous_entities: AdminPermissionsStateEntities  /** Backup entities before update : Usefull to revert entities when error occured */
    dirty_entities: AdminPermissionsStateDirtyEntities /** Dirty entities collection that have been updated and required backend updates */
    denormalized: AdminPermissionsEntitiesTypes /** denormalized ROLE entities */
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
    is_dirty: boolean | Observable<boolean>
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

