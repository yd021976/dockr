/**
 * Service data model declaration
 */
export interface BaseDataModelProperty {
    uid?:string
    id: string
    type: string
    allowed: boolean
}

export interface DataModelPropertyEntity extends BaseDataModelProperty{
    children?:DataModelPropertyEntities
}


export interface DataModelPropertyEntities {
    [uuid: string]: DataModelPropertyEntity
}

export interface DataModelStateModel {
    entities: DataModelPropertyEntities;
    isLoading: boolean;
    isError: boolean;
    error: string;
}