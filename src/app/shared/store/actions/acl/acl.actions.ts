import { RoleModel } from "src/app/shared/models/acl/roles.model";
import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";
import { BackendServiceModel } from "src/app/shared/models/acl/backend-services.model";

export class Acl_Roles_LoadAll {
    static readonly type = '[acl roles] load all';
    constructor(public roles: RoleModel[]) { }
}
export class Acl_Roles_LoadAll_Success {
    static readonly type = '[acl roles] load all success';
    constructor(public roles: RoleModel[]) { }
}
export class Acl_Roles_LoadAll_Error {
    static readonly type = '[acl roles] load all error';
    constructor(public error: string) { }
}
export class Acl_Role_Add_Service {
    static readonly type = '[acl roles] Add Service';
    constructor(public roleUid: string, public backendServiceModel: BackendServiceModel) { }
}
export class Acl_Role_Add_Service_Success {
    static readonly type = '[acl roles] Add Service success';
    constructor(public roleUid: string, public backendServiceModel: BackendServiceModel) { }
}
export class Acl_Role_Add_Service_Error {
    static readonly type = '[acl roles] Add Service error';
    constructor(public error: string) { }
}

export class Acl_Select_node {
    static readonly type = '[acl] select node';
    constructor(public currentNode: FlatTreeNode) { }
}