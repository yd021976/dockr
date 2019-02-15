import { BackendServiceModel, BackendServicesModel } from "./backend-services.model";

/**
 * Template object
 */
export interface RoleModel {
    _id: string;
    name: string;
    services: BackendServicesModel
}

/**
 * Templates list
 */
export interface RolesNormalized {
    [id: string]: RoleModel;
}
export interface RolesModel {
    roles: RolesNormalized;
    isLoading: boolean;
    isError: boolean;
    error: string;
} 