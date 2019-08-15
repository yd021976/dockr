import { ALLOWED_STATES } from "./acl.service.action.model";

/**
 * Service data model declaration
 */
export interface BaseServiceField {
    uid?: string
    id: string
    type: string
    allowed?: ALLOWED_STATES
}

export interface ServiceFieldEntity extends BaseServiceField {
    fields?: string[]
}
export interface ServiceFieldModel extends BaseServiceField {
    fields?: ServiceFieldModel[]
}


export interface ServiceFieldEntities {
    [ uuid: string ]: ServiceFieldEntity
}

export interface ServiceFieldStateModel {
    entities: ServiceFieldEntities;
    isLoading: boolean;
    isError: boolean;
    error: string;
}