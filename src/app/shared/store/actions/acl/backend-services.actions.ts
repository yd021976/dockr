import { BackendServicesEntities, BackendServiceModel } from "../../../models/acl/backend-services.model";

export class BackendserviceLoadAll {
    static readonly type = '[backendservices] load all';
    constructor() { }
}
export class BackendserviceLoadAllSuccess {
    static readonly type = '[backendservices] load all success';
    constructor(public backendservices: BackendServicesEntities) { }
}
export class BackendserviceLoadAllError {
    static readonly type = '[backendservices] load all error';
    constructor(public error: string) { }
}

export class ServicesAddService {
    static readonly type = '[backendservices] add service';
    constructor() { }
}
export class ServicesAddServiceSuccess {
    static readonly type = '[backendservices] add service success';
    constructor(public service: BackendServiceModel) { }
}