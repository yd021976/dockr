export abstract class dataModelProperty {
    type:string;
    allowed:boolean;
    children?:dataModel
}
/**
 * Service data model declaration
 */
export abstract class dataModel {
    [property: string]: dataModelProperty;
}

/**
 * The backend service class
 */
export class BackendServiceModel {
    id: string;
    name: string;
    description: string;
    dataModel: dataModel;
}

/**
 * list of backend services
 */
export class BackendServicesModel {
    [id: string]: BackendServiceModel
}