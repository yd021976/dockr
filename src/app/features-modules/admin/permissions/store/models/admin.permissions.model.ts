import { THIS_EXPR } from "@angular/compiler/src/output/output_ast"

export type AdminPermissionsEntitiesTypes = AdminPermissionsRoleEntities | AdminPermissionsServiceEntities | AdminPermissionsOperationEntities | AdminPermissionsFieldEntities
export type AdminPermissionsEntityTypes = AdminPermissionsRoleEntity | AdminPermissionsServiceEntity | AdminPermissionsOperationEntity | AdminPermissionsFieldEntity
export type EntityChildren = Array<string>

export enum ALLOWED_STATES {
    ALLOWED = "1",
    FORBIDDEN = "0",
    INDETERMINATE = "indeterminate"
}

/**
 * 
 */
export class AdminPermissionsBaseModel {
    id: string
    name: string
    allowed?: ALLOWED_STATES
    uid?: string
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
 * Permissions entities
 */
export class AdminPermissionsStateEntities {
    root_results: EntityChildren
    roles: AdminPermissionsRoleEntities
    services: AdminPermissionsServiceEntities
    operations: AdminPermissionsOperationEntities
    fields: AdminPermissionsFieldEntities
}

/**
 * State model for "roles" data
 */
export class AdminPermissionsStateModel {
    entities: AdminPermissionsStateEntities
    previous_entities: AdminPermissionsStateEntities  // Backup entities before update : Usefull to revert entities when error occured
}

/**
 * State model for UI
 */
// export class AdminPermissionsStateUIModel extends BaseUIModel {
//     selectedNode: FlatTreeNode
// }

export interface TreeViewColumnModel {
    colName: string
    size: string
}

export type NodeTreeviewColumnModel = {
    column_model: TreeViewColumnModel[], // The colmun model
    columns_before_node: TreeViewColumnModel[], // columns before the node
    columns_after_node: TreeViewColumnModel[], // columns after the node
    column_size: string,
    node_padding_left: number, // Node indent : Left padding for node level > # of columns in column model property
}

export class AdminPermissionsFlatNode {
    item: AdminPermissionsEntityTypes
    level: number
    expandable: boolean
}

export class AdminPermissionsStateUIModel {
    selected: AdminPermissionsFlatNode
}