import { BackendServiceModel, BackendServicesModel } from "./backend-services.model";

/**
 * Template object
 */
export class RoleModel {
    _id: string;
    name: string;
    services: BackendServicesModel
}

/**
 * Templates list
 */
export abstract class RolesNormalized {
    [id: string]: RoleModel;
}
export class RolesModel {
    roles: RolesNormalized;
    isLoading: boolean;
    isError: boolean;
    error: string;
} 