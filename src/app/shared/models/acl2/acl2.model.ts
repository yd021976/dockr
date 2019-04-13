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
    selectedNode:FlatTreeNode
    entities: Acl2StateEntities
}