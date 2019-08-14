import { RoleEntities } from "../acl/roles.model";
import { BackendServicesEntities } from "../acl/backend-services.model";
import { CrudOperationsModelEntities } from "../acl/crud-operations.model";
import { DataModelPropertyEntities } from "../acl/datamodel.model";
import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";

/**
 * Roles entities
 */
export class AclEntities {
    roles: RoleEntities
    services: BackendServicesEntities
    actions: CrudOperationsModelEntities
    fields: DataModelPropertyEntities
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