import { RoleModel } from "src/app/shared/models/roles.model";
import { BackendServiceModel } from "src/app/shared/models/backend-services.model";

export class AclFlatTreeNode {
    data: RoleModel | BackendServiceModel
    expandable: boolean
    level: number
}

export class AclTreeNode {
    objectData : RoleModel | BackendServiceModel
    children:AclTreeNode[]
    type: 'role' | 'service' | 'dataModel'
}