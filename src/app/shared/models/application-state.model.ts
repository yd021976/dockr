import { UserModel } from "./user.model";
import { TemplatesModel } from "./templates.model";
import { AclModel } from "./acl.model";
import { RolesModel } from "./roles.model";
import { BackendServicesModel } from "./backend-services.model";

export class ApplicationStateModel {
    // isProgress:boolean; // Indicates something in progress (login, performing long action ...)
    // isLoggedIn:boolean; // Is a user logged in (except for anonymous that are considered as not logged in users)
    user: UserModel
    templates: TemplatesModel
    roles: RolesModel
    backendServices: BackendServicesModel
}