import { AdminPermissionsFlatNode } from "../models/admin.permissions.model";

export namespace AdminPermissionsUIActions {
    export class SelectTreeviewNode {
        static readonly type = "[Site Zones UI] Select treeview node"
        public constructor(public node: AdminPermissionsFlatNode) { }
    }
}