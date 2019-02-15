import { RoleModel, RolesNormalized } from "../../models/roles.model";

export class RolesLoadAction {
    static readonly type = '[roles] load';
    constructor() { }
}
export class RolesLoadSuccessAction {
    static readonly type = '[roles] load success';
    constructor(public roles: RoleModel[]) { }
}
export class RolesLoadErrorAction {
    static readonly type = '[roles] load error';
    constructor(public error: string) { }
}
export class RolesLoadReset {
    static readonly type = '[roles] load reset';
    constructor() { }
}
export class RolesAdd {
    static readonly type = '[roles] add';
    constructor(public role: RoleModel) { }
}
export class RolesAddSuccess {
    static readonly type = '[roles] add success';
    constructor(public role: RoleModel) { }
}
export class RolesAddError {
    static readonly type = '[roles] add error';
    constructor(public error: string) { }
}
export class RolesRemove {
    static readonly type = '[roles] remove';
    constructor(public role: RoleModel) { }
}
export class RolesRemoveSuccess {
    static readonly type = '[roles] remove success';
    constructor(public role: RoleModel) { }
}
export class RolesRemoveError {
    static readonly type = '[roles] remove error';
    constructor(public error: string) { }
}
