import { FlatTreeNode } from "src/app/shared/models/treenode.model";

export namespace AclUIActions {
    

    export class Acl_Tree_Node_Select {
        static readonly type = '[acl ui] select node';
        constructor( public currentNode: FlatTreeNode ) { }
    }

    export class Resource_Lock {
        static readonly type = '[acl ui] resource lock';
        constructor() { }
    }
    export class Resource_Lock_Success {
        static readonly type = '[acl ui] Lock resource success';
        constructor() { }
    }
    export class Resource_Lock_Error {
        static readonly type = '[acl ui] Lock resource error';
        constructor( public error: string ) { }
    }

    export class Resource_UnLock {
        static readonly type = '[acl ui] resource unlock ';
        constructor() { }
    }
    export class Resource_UnLock_Success {
        static readonly type = '[acl ui] resource unlock success';
        constructor() { }
    }
    export class Resource_UnLock_Error {
        static readonly type = '[acl ui] resource unlock error';
        constructor( public error: string ) { }
    }
}

