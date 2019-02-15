import { RolesModel } from "./roles.model";
import { BackendServicesModel } from "./backend-services.model";

export class AclModel {
    roles:RolesModel;
    backendServices:BackendServicesModel;
}