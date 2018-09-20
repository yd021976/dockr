import { loginCredentials, UserModel, UserBackendApiModel } from '../../models/user.model';


export class UserLoginAction {
    static readonly type = '[user] login';
    constructor(public credentials: loginCredentials) { }
}
export class UserLoginSuccessAction {
    static readonly type = '[user] login success';
    constructor(public user: UserBackendApiModel) { }
}

export class UserLoginErrorAction {
    static readonly type = '[user] login error';
    constructor(public error: string) { }
}

export class UserLogoutAction {
    static readonly type = '[user] logout';
    constructor() { }
}
export class UserLogoutSuccessAction {
    static readonly type = '[user] logout success';
    constructor() { }
}
export class UserLogoutErrorAction {
    static readonly type = '[user] logout error';
    constructor(public error:string) { }
}
