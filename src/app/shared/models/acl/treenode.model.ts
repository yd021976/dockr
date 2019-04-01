export interface AclTreeNode {
    name: string
    uid: string
    type: NodeTypes
    children?: AclTreeNode[]
    checked?: boolean
}

export enum NODE_TYPES {
    UNKNOWN = "",
    ROLE = "role",
    SERVICE = "service",
    CRUDOPERATION = "crud_operation",
    FIELDACCESS = "field_access"
}
export type NodeTypes = NODE_TYPES
