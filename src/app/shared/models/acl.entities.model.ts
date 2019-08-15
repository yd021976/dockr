import { AclRoleEntities } from "./acl.role.model";
import { AclServicesEntities } from "./acl.services.model";
import { AclServiceActionModelEntities } from "./acl.service.action.model";
import { ServiceFieldEntities } from "./acl.service.field.model";
import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";

/**
 * Roles entities
 */
export class AclEntities {
    roles: AclRoleEntities
    services: AclServicesEntities
    actions: AclServiceActionModelEntities
    fields: ServiceFieldEntities
}

/**
 * State model for "roles" data
 */
export class AclStateEntitiesModel {
    entities: AclEntities
    previous_entities: AclEntities  // Backup entities before update : Usefull to revert entities when error occured
}

/**
 * State model for UI
 */
export class AclStateUIModel {
    isLoading: boolean
    isError: boolean
    error: string
    selectedNode: FlatTreeNode
}