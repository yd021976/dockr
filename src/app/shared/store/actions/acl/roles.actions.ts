import { RoleModel, RoleEntities } from "../../../models/acl/roles.model";

export class RolesLoadAllAction {
    static readonly type = '[roles] load';
    constructor() { }
}
export class RolesLoadAllSuccessAction {
    static readonly type = '[roles] load success';
    constructor(public roles: RoleEntities) { }
}
export class RolesLoadAllErrorAction {
    static readonly type = '[roles] load error';
    constructor(public error: string) { }
}
export class RolesResetAll {
    static readonly type = '[roles] load reset';
    constructor() { }
}


/**
 *  Roles entity operations
 */
export class RolesUpdateRoleAction {
    static readonly type = '[roles] update role';
    constructor(public role:RoleModel) { }
}
export class RolesUpdateRoleSuccessAction {
    static readonly type = '[roles] update role success';
    constructor(public role:RoleModel) { }
}
export class RolesUpdateRoleErrorAction {
    static readonly type = '[roles] update role error';
    constructor(public error: string) { }
}
export class RolesAddRoleAction {
    static readonly type = '[roles] add';
    constructor(public role: RoleModel) { }
}
export class RolesAddRoleSuccessAction {
    static readonly type = '[roles] add success';
    constructor(public role: RoleModel) { }
}
export class RolesAddRoleErrorAction {
    static readonly type = '[roles] add error';
    constructor(public error: string) { }
}
export class RolesRemoveRoleAction {
    static readonly type = '[roles] remove';
    constructor(public role: RoleModel) { }
}
export class RolesRemoveRoleSuccessAction {
    static readonly type = '[roles] remove success';
    constructor(public role: RoleModel) { }
}
export class RolesRemoveRoleErrorAction {
    static readonly type = '[roles] remove error';
    constructor(public error: string) { }
}