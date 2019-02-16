import { RoleModel } from "src/app/shared/models/roles.model";
import { BackendServiceModel, dataModel, CrudOperationModel } from "src/app/shared/models/backend-services.model";


export enum NODE_TYPES {
    UNKNOWN,
    ROLE="role",
    SERVICE="service",
    CRUD_OPERATION="crud_operation",
    FIELD_ACCESS="field_access"
}
export type NodeData = RoleModel | BackendServiceModel | CrudOperationModel | dataModel 
export type NodeType = NODE_TYPES

export class AclFlatTreeNode {
    data: NodeData
    expandable: boolean
    level: number
    type:NodeType
}


export class AclTreeNode {
    data: NodeData
    children: AclTreeNode[]
    type: NodeType
}