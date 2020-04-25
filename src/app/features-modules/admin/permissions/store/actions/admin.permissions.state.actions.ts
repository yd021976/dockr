import { ALLOWED_STATES, AdminPermissionsFlatNode } from "../models/admin.permissions.model";

export namespace AdminPermissionsStateActions {
    export class NodeUpdateAllowedStatus {
        static readonly type = '[node update allowed]'
        constructor(public node: AdminPermissionsFlatNode, public allowed_status: ALLOWED_STATES) { }
    }
}