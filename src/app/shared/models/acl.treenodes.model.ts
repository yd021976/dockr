import { NODE_TYPES } from "./treenode.model";

export interface TreeNodes {
    uid: string
    type: NODE_TYPES
    children: string[]
}