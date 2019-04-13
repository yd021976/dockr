import { BackendServiceModel } from "../../models/acl/backend-services.model";

export class Services_Load_All {
    static readonly type = '[services] load all';
    constructor() { }
}
export class Services_Load_All_Success {
    static readonly type = '[services] load all success';
    constructor(public services: BackendServiceModel[]) { }
}
export class Services_Load_All_Error {
    static readonly type = '[services] load all error';
    constructor(public error: string) { }
}