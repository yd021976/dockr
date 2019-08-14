import { UserModel, UsersModel } from "./user.model";
import { TemplatesModel } from "./templates.model";
import { ServicesModel } from "./services.model";
import { ApplicationNotificationsModel } from "./application.notifications.model";

export class ApplicationStateModel {
    user: UserModel
    users:UsersModel
    templates: TemplatesModel
    backendServices:ServicesModel
    notifications : ApplicationNotificationsModel
}