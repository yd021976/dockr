import { ALLOWED_STATES } from "src/app/shared/models/acl.service.action.model";

export class Acl_Action_Update_Allowed {
    static readonly type = '[acl action] update allowed property';
    constructor(public entity_uid: string, public allowed: ALLOWED_STATES) { }
}
export class Acl_Action_Update_Allowed_Success {
    static readonly type = '[acl action] update allowed property success';
    constructor(public entity_uid: string, public allowed: ALLOWED_STATES) { }
}
export class Acl_Action_Update_Allowed_Error {
    static readonly type = '[acl action] update allowed property error';
    constructor(public error: string) { }
}