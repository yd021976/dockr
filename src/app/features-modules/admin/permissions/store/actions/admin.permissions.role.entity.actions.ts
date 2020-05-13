import { AclRoleModel } from "src/app/shared/models/acl.role.model";
import { BackendServiceModel } from "src/app/shared/models/acl.services.model";
import { AdminPermissionsRoleEntity, AdminPermissionsRoleEntities, AdminPermissionsEntityTypes, AdminPermissionsServiceEntity } from "../models/admin.permissions.model";

export namespace AdminPermissionsRolesStateActions {
    export class Load_All {
        static readonly type = '[admin permissions] roles load all';
        constructor() { }
    }
    export class Load_All_Success {
        static readonly type = '[admin permissions] roles load all success';
        constructor(public roles: AdminPermissionsEntityTypes[]) { }
    }
    export class Load_All_Error {
        static readonly type = '[admin permissions] roles load all error';
        constructor(public error: string) { }
    }

    export class Add_Entity {
        static readonly type = '[admin permissions] add role entity';
        constructor(public entity_name: string, public entity_uid: string = null) { }
    }

    export class Remove_Entity {
        static readonly type = '[admin permissions] remove role entity';
        constructor(public role_entity_uid: string) { }
    }

    export class Add_Service {
        static readonly type = '[admin permissions] Add Service';
        constructor(public role_entity: AdminPermissionsRoleEntity, public service_to_add: BackendServiceModel) { }
    }
    export class Remove_Service {
        static readonly type = '[admin permissions] Remove Service';
        constructor(public role_uid: string, public service_to_remove: AdminPermissionsServiceEntity) { }
    }

    export class denormalize {
        static readonly type = '[admin permissions] denormalize';
        constructor(public role_entities: AdminPermissionsRoleEntities) { }
    }
}