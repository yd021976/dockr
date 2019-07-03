import { UserModelBase } from "../../models/user.model";
import { RoleModel } from "../../models/acl/roles.model";

export class Users_Load_All {
    static readonly type = '[users] load all';
    constructor() { }
}
export class Users_Load_All_Success {
    static readonly type = '[users] load all success';
    constructor( public users: UserModelBase[] ) { }
}
export class Users_Load_All_Error {
    static readonly type = '[users] load all error';
    constructor( public error: string ) { }
}

export class Users_Add {
    static readonly type = '[users] add';
    constructor( public user: UserModelBase ) { }
}
export class Users_Add_Success {
    static readonly type = '[users] add success';
    constructor( public user: UserModelBase ) { }
}
export class Users_Add_Error {
    static readonly type = '[users] add error';
    constructor( public error: string ) { }
}

export class Users_Remove {
    static readonly type = '[users] remove';
    constructor( public user: UserModelBase ) { }
}
export class Users_Remove_Success {
    static readonly type = '[users] remove success';
    constructor( public user: UserModelBase ) { }
}
export class Users_Remove_Error {
    static readonly type = '[users] remove error';
    constructor( public error: string ) { }
}
export class Users_Select_User {
    static readonly type = '[users] select';
    constructor( public user: UserModelBase ) { }
}

export class Users_Add_Role {
    static readonly type = '[users] add role';
    constructor( public user: UserModelBase, public role: RoleModel ) { }
}
export class Users_Add_Role_Success {
    static readonly type = '[users] add role success';
    constructor( public user: UserModelBase, public role: RoleModel ) { }
}
export class Users_Add_Role_Error {
    static readonly type = '[users] add role error';
    constructor( public error: string ) { }
}
export class Users_Remove_Role {
    static readonly type = '[users] remove role';
    constructor( public user: UserModelBase, public role: RoleModel ) { }
}
export class Users_Remove_Role_Success {
    static readonly type = '[users] remove role success';
    constructor( public user: UserModelBase, public role: RoleModel ) { }
}
export class Users_Remove_Role_Error {
    static readonly type = '[users] remove role error';
    constructor( public error: string ) { }
}