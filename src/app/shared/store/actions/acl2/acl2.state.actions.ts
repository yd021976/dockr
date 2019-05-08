import { RoleModel } from "src/app/shared/models/acl/roles.model";
import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";

export class Acl_Load_All {
    static readonly type = '[acl] load all';
    constructor(public roles: RoleModel[]) { }
}
export class Acl_Load_All_Success {
    static readonly type = '[acl] load all success';
    constructor(public roles: RoleModel[]) { }
}
export class Acl_Load_All_Error {
    static readonly type = '[acl] load all error';
    constructor(public error: string) { }
}


export class Acl_Tree_Node_Select {
    static readonly type = '[acl] select node';
    constructor(public currentNode: FlatTreeNode) { }
}