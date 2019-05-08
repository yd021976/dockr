import { ALLOWED_STATES } from "./crud-operations.model";

/**
 * Service data model declaration
 */
export interface BaseDataModelProperty {
    uid?: string
    id: string
    type: string
    allowed?: ALLOWED_STATES
}

export interface DataModelPropertyEntity extends BaseDataModelProperty {
    children?: string[]
}
export interface DataModelPropertyModel extends BaseDataModelProperty {
    children?: DataModelPropertyModel[]
}


export interface DataModelPropertyEntities {
    [ uuid: string ]: DataModelPropertyEntity
}

export interface DataModelStateModel {
    entities: DataModelPropertyEntities;
    isLoading: boolean;
    isError: boolean;
    error: string;
}