import { ALLOWED_STATES } from "src/app/shared/models/acl/crud-operations.model";

export class Acl_Field_Update_Allowed {
    static readonly type = '[acl field] update allowed property';
    constructor(public entity_uid:string,public allowed:ALLOWED_STATES) { }
}
export class Acl_Field_Update_Allowed_Success {
    static readonly type = '[acl field] update allowed property success';
    constructor(public entity_uid:string,public allowed:ALLOWED_STATES) { }
}
export class Acl_Field_Update_Allowed_Error {
    static readonly type = '[acl field] update allowed property error';
    constructor(public error: string) { }
}