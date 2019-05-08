import { RoleModel } from "src/app/shared/models/acl/roles.model";
import { BackendServiceModel } from "src/app/shared/models/acl/backend-services.model";

export class Acl_Roles_Add_Entity{
    static readonly type = '[acl role] Add entity';
    constructor(public roleEntity:RoleModel) { }
}
export class Acl_Roles_Add_Entity_Success{
    static readonly type = '[acl role] Add entity success';
    constructor(public roleEntity:RoleModel) { }
    
}
export class Acl_Roles_Add_Entity_Error{
    static readonly type = '[acl role] Add entity error';
    constructor(public error:string) { }
}
export class Acl_Roles_Remove_Entity{
    static readonly type = '[acl role] remove entity';
    constructor(public roleUid:string) { }
}
export class Acl_Role_Remove_Entity_Success{
    static readonly type = '[acl role] Add remove success';
    constructor(public roleUid:string) { }
    
}
export class Acl_Roles_Remove_Entity_Error{
    static readonly type = '[acl role] Add remove error';
    constructor(public error:string) { }
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