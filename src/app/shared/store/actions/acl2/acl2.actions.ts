import { RoleModel } from "src/app/shared/models/acl/roles.model";
import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";

export class Acl_LoadAll {
    static readonly type = '[acl] load all';
    constructor(public roles: RoleModel[]) { }
}
export class Acl_LoadAll_Success {
    static readonly type = '[acl] load all success';
    constructor(public roles: RoleModel[]) { }
}
export class Acl_LoadAll_Error {
    static readonly type = '[acl] load all error';
    constructor(public error: string) { }
}


export class Acl_node_select {
    static readonly type = '[acl] select node';
    constructor(public currentNode: FlatTreeNode) { }
}