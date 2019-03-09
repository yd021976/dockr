import { NODE_TYPES } from "src/app/features-modules/admin/services/acl-flat-tree-node.model";

export interface AclTreeNode {
    name: string
    uid: string
    type: NODE_TYPES
    children?: AclTreeNode[]
    checked?: boolean
}