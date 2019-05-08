export class Acl_Services_Remove_Entity {
    static readonly type: string = "[Acl Services] remove entity"
    constructor( public service_uid: string ) { }
}
export class Acl_Services_Remove_Entity_Success {
    static readonly type: string = "[Acl Services] remove entity success"
    constructor( public service_uid: string ) { }
}
export class Acl_Services_Remove_Entity_Error {
    static readonly type: string = "[Acl Services] remove entity error"
    constructor( public error: string ) { }
}