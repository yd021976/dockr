import { RoleEntities, RoleEntity } from "../acl/roles.model";
import { BackendServicesEntities } from "../acl/backend-services.model";
import { CrudOperationsModelEntities } from "../acl/crud-operations.model";
import { DataModelPropertyEntities } from "../acl/datamodel.model";
import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";

export class Acl2StateEntities {
    roles: RoleEntities
    services: BackendServicesEntities
    actions: CrudOperationsModelEntities
    fields: DataModelPropertyEntities
}
export class Acl2StateModel {
    isLoading: boolean
    isError: boolean
    error: string
    isLocked: boolean
    selectedNode: FlatTreeNode
    entities: Acl2StateEntities
    previous_entities: Acl2StateEntities // Backup entities before update : Usefull to revert entities when error occured
}