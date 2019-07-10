import { RoleModel } from "src/app/shared/models/acl/roles.model";
import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";

export class Acl_Load_All {
    static readonly type = '[acl] load all';
    constructor() { }
}
export class Acl_Load_All_Success {
    static readonly type = '[acl] load all success';
    constructor( public roles: RoleModel[] ) { }
}
export class Acl_Load_All_Error {
    static readonly type = '[acl] load all error';
    constructor( public error: Error ) { }
}


export class Acl_Tree_Node_Select {
    static readonly type = '[acl] select node';
    constructor( public currentNode: FlatTreeNode ) { }
}

export class Acl_Lock_Resource {
    static readonly type = '[acl] Lock resource';
    constructor() { }
}
export class Acl_Lock_Resource_Success {
    static readonly type = '[acl] Lock resource success';
    constructor() { }
}
export class Acl_Lock_Resource_Error {
    static readonly type = '[acl] Lock resource error';
    constructor( public error: Error ) { }
}

export class Acl_UnLock_Resource {
    static readonly type = '[acl] Unlock resource';
    constructor() { }
}
export class Acl_UnLock_Resource_Success {
    static readonly type = '[acl] Unlock resource success';
    constructor() { }
}
export class Acl_UnLock_Resource_Error {
    static readonly type = '[acl] Unlock resource error';
    constructor( public error: Error ) { }
}