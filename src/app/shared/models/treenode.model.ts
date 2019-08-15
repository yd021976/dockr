import { ALLOWED_STATES } from "./acl.service.action.model";

export interface AclTreeNode {
    name: string
    uid: string
    type: NodeTypes
    children?: AclTreeNode[]
    checked?: ALLOWED_STATES
}

export enum NODE_TYPES {
    UNKNOWN = "",
    ROLE = "role",
    SERVICE = "service",
    CRUDOPERATION = "crud_operation",
    FIELDACCESS = "field_access"
}
export type NodeTypes = NODE_TYPES
