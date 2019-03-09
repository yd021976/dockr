export interface AclTreeNode {
    name: string
    uid: string
    type: NodeTypes
    children?: AclTreeNode[]
    checked?: boolean
}

export enum NODE_TYPES {
    UNKNOWN,
    ROLE = "role",
    SERVICE = "service",
    CRUD_OPERATION = "crud_operation",
    FIELD_ACCESS = "field_access"
}
export type NodeTypes = NODE_TYPES
