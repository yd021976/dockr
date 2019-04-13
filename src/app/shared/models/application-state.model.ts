import { UserModel } from "./user.model";
import { TemplatesModel } from "./templates.model";
import { RolesStateModel } from "./acl/roles.model";
import { BackendServicesEntities } from "./acl/backend-services.model";
import { AclStateModel } from "./acl/acl.model";
import { ServicesModel } from "./services.model";
import { Acl2StateModel } from "./acl2/acl2.model";

export class ApplicationStateModel {
    // isProgress:boolean; // Indicates something in progress (login, performing long action ...)
    // isLoggedIn:boolean; // Is a user logged in (except for anonymous that are considered as not logged in users)
    user: UserModel
    templates: TemplatesModel
    // roles: RolesStateModel
    // backendServices: BackendServicesEntities
    acl2: Acl2StateModel
    backendServices:ServicesModel
}