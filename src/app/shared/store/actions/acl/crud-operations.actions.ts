import { CrudOperationsModelEntities, CrudOperationModelEntity } from "src/app/shared/models/acl/crud-operations.model";

export class CrudOperations_LoadAll {
    static readonly type = '[CrudOperations] load all';
    constructor() { }
}
export class CrudOperations_LoadAll_Success {
    static readonly type = '[CrudOperations] load all success';
    constructor(public crudOperations: CrudOperationsModelEntities) { }
}
export class CrudOperations_LoadAll_Error {
    static readonly type = '[CrudOperations] load all error';
    constructor(public error: string) { }
}
export class CrudOperations_Update {
    static readonly type = '[CrudOperations] update';
    constructor(public entity: CrudOperationModelEntity) { }
}
export class CrudOperations_Update_Success {
    static readonly type = '[CrudOperations] update success';
    constructor(public entity: CrudOperationModelEntity) { }
}
export class CrudOperations_Update_Error {
    static readonly type = '[CrudOperations] update error';
    constructor(public error: string) { }
}