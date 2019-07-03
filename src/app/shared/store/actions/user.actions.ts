import { UserBackendApiModel } from '../../models/user.model';


export class User_Action_Login {
    static readonly type = '[user] login';
    constructor() { }
}
export class User_Action_Login_Success {
    static readonly type = '[user] login success';
    constructor( public user: UserBackendApiModel ) { }
}

export class User_Action_Login_Error {
    static readonly type = '[user] login error';
    constructor( public error: string ) { }
}

export class User_Action_Logout {
    static readonly type = '[user] logout';
    constructor() { }
}
export class User_Action_Logout_Success {
    static readonly type = '[user] logout success';
    constructor() { }
}
export class User_Action_Logout_Error {
    static readonly type = '[user] logout error';
    constructor( public error: string ) { }
}