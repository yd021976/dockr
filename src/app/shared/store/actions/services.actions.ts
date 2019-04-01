import { BackendServiceModel } from "../../models/acl/backend-services.model";

export class ServicesLoadAll {
    static readonly type = '[services] load all';
    constructor() { }
}
export class ServicesLoadAll_Success {
    static readonly type = '[services] load all success';
    constructor(public services: BackendServiceModel[]) { }
}
export class ServicesLoadAll_Error {
    static readonly type = '[services] load all error';
    constructor(public error: string) { }
}