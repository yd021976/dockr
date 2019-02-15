export interface dataModelProperty {
    type: string;
    allowed: boolean;
    children?: dataModel
}
/**
 * Service data model declaration
 */
export interface dataModel {
    [property: string]: dataModelProperty;
}

/**
 * The backend service class
 */
export interface BackendServiceModel {
    id: string;
    name: string;
    description: string;
    dataModel: dataModel;
}

/**
 * list of backend services
 */
export interface BackendServicesModel {
    [id: string]: BackendServiceModel
}