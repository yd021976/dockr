import { AclRoleModel } from "src/app/shared/models/acl.role.model";
import { AclServiceModel } from "src/app/shared/models/acl.services.model";

export namespace AdminPermissionsRolesStateActions {
    export class Load_All {
        static readonly type = '[admin permissions role state] roles load all';
        constructor() { }
    }
    export class Load_All_Success {
        static readonly type = '[admin permissions role state| roles load all success';
        constructor( public roles: AclRoleModel[] ) { }
    }
    export class Load_All_Error {
        static readonly type = '[admin permissions role state| roles load all error';
        constructor( public error: string ) { }
    }

    export class Add_Entity {
        static readonly type = '[admin permissions role state| Add entity';
        constructor( public roleEntity: AclRoleModel ) { }
    }
    export class Add_Entity_Success {
        static readonly type = '[admin permissions role state| Add entity success';
        constructor( public roleEntity: AclRoleModel ) { }

    }
    export class Add_Entity_Error {
        static readonly type = '[admin permissions role state| Add entity error';
        constructor( public error: string ) { }
    }
    export class Remove_Entity {
        static readonly type = '[admin permissions role state| remove entity';
        constructor( public roleUid: string ) { }
    }
    export class Remove_Entity_Success {
        static readonly type = '[admin permissions role state| Add remove success';
        constructor( public roleUid: string ) { }

    }
    export class Remove_Entity_Error {
        static readonly type = '[admin permissions role state| Add remove error';
        constructor( public error: string ) { }
    }

    export class Add_Service {
        static readonly type = '[admin permissions role state| Add Service';
        constructor( public roleUid: string, public backendServiceModel: AclServiceModel ) { }
    }
    export class Add_Service_Success {
        static readonly type = '[admin permissions role state| Add Service success';
        constructor( public roleUid: string, public backendServiceModel: AclServiceModel ) { }
    }
    export class Add_Service_Error {
        static readonly type = '[admin permissions role state| Add Service error';
        constructor( public error: string ) { }
    }
}