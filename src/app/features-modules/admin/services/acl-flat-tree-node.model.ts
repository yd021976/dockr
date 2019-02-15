import { RoleModel } from "src/app/shared/models/roles.model";
import { BackendServiceModel, dataModel } from "src/app/shared/models/backend-services.model";

export class AclFlatTreeNode {
    data: RoleModel | BackendServiceModel | dataModel
    expandable: boolean
    level: number
}

export type NodeType = 'role' | 'service' | 'dataModel' | ''

export class AclTreeNode {
    objectData : RoleModel | BackendServiceModel | dataModel
    children:AclTreeNode[]
    type: NodeType 
}