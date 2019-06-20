import { UserModel } from "./user.model";
import { TemplatesModel } from "./templates.model";
import { ServicesModel } from "./services.model";
import { ApplicationNotificationsModel } from "./acl2/application.notifications.model";

export class ApplicationStateModel {
    user: UserModel
    templates: TemplatesModel
    backendServices:ServicesModel
    notifications : ApplicationNotificationsModel
}