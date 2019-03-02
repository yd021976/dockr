import { DataModelPropertyEntities } from "../../../models/acl/datamodel.model";

export class DataModelsLoadAll {
    static readonly type = '[DataModels] load all';
    constructor() { }
}
export class DataModelsLoadAllSuccess {
    static readonly type = '[DataModels] load all success';
    constructor(public datamodels:DataModelPropertyEntities) { }
}
export class DataModelsLoadAllError {
    static readonly type = '[DataModels] load all error';
    constructor(public error:string) { }
}