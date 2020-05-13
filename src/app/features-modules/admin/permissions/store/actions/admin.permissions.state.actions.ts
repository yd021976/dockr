import { ALLOWED_STATES, AdminPermissionsFlatNode, AdminPermissionsRoleEntity } from "../models/admin.permissions.model";

export namespace AdminPermissionsStateActions {
    export class NodeUpdateAllowedStatus {
        static readonly type = '[admin permissions] node update allowed property'
        constructor(public node: AdminPermissionsFlatNode, public allowed_status: ALLOWED_STATES) { }
    }
    export class CancelChanges {
        static readonly type = '[admin permissions] cancel changes'
        constructor(public node: AdminPermissionsFlatNode = null) { }
    }
    export class RoleSaved {
        static readonly type = '[admin permissions] dirty role saved'
        constructor(public entity_uid: string) { }
    }
}