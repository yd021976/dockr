import { AdminPermissionsFlatNode } from "../models/admin.permissions.model";

export namespace AdminPermissionsUIActions {
    export class SelectTreeviewNode {
        static readonly type = "[admin permissions] select treeview node"
        public constructor(public node: AdminPermissionsFlatNode) { }
    }
}