import { UserModel } from "./user.model";
import { TemplatesModel } from "./templates.model";
import { ServicesModel } from "./services.model";
import { ApplicationErrorModel } from "./app-error.model";

export class ApplicationStateModel {
    user: UserModel
    templates: TemplatesModel
    backendServices:ServicesModel
    appErrors : ApplicationErrorModel
}