import { AclRoleModel } from "src/app/shared/models/acl.role.model";
import { BackendServiceModel } from "src/app/shared/models/acl.services.model";

export namespace RolesStateActions {
    export class Load_All {
        static readonly type = '[acl ui] roles load all';
        constructor() { }
    }
    export class Load_All_Success {
        static readonly type = '[acl ui] roles load all success';
        constructor( public roles: AclRoleModel[] ) { }
    }
    export class Load_All_Error {
        static readonly type = '[acl ui] roles load all error';
        constructor( public error: string ) { }
    }

    export class Add_Entity {
        static readonly type = '[acl role] Add entity';
        constructor( public roleEntity: AclRoleModel ) { }
    }
    export class Add_Entity_Success {
        static readonly type = '[acl role] Add entity success';
        constructor( public roleEntity: AclRoleModel ) { }

    }
    export class Add_Entity_Error {
        static readonly type = '[acl role] Add entity error';
        constructor( public error: string ) { }
    }
    export class Remove_Entity {
        static readonly type = '[acl role] remove entity';
        constructor( public roleUid: string ) { }
    }
    export class Remove_Entity_Success {
        static readonly type = '[acl role] Add remove success';
        constructor( public roleUid: string ) { }

    }
    export class Remove_Entity_Error {
        static readonly type = '[acl role] Add remove error';
        constructor( public error: string ) { }
    }

    export class Add_Service {
        static readonly type = '[acl roles] Add Service';
        constructor( public roleUid: string, public backendServiceModel: BackendServiceModel ) { }
    }
    export class Add_Service_Success {
        static readonly type = '[acl roles] Add Service success';
        constructor( public roleUid: string, public backendServiceModel: BackendServiceModel ) { }
    }
    export class Add_Service_Error {
        static readonly type = '[acl roles] Add Service error';
        constructor( public error: string ) { }
    }
}