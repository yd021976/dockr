import { DataModelPropertyEntities, DataModelPropertyEntity } from "../../../models/acl/datamodel.model";

export class DataModelsLoadAll {
    static readonly type = '[DataModels] load all';
    constructor() { }
}
export class DataModelsLoadAllSuccess {
    static readonly type = '[DataModels] load all success';
    constructor(public datamodels: DataModelPropertyEntities) { }
}
export class DataModelsLoadAllError {
    static readonly type = '[DataModels] load all error';
    constructor(public error: string) { }
}

export class DataModelUpdate {
    static readonly type = '[DataModel] update';
    constructor() { }
}
export class DataModelUpdateSuccess {
    static readonly type = '[DataModel] update success';
    constructor(public field: DataModelPropertyEntity) { }
}
export class DataModelUpdateError {
    static readonly type = '[DataModel] update error';
    constructor(public error: string) { }
}

export class DataModel_Add_Fields_Success {
    static readonly type = '[DataModel] Add fields success';
    constructor(public fields: DataModelPropertyEntities) { }
}