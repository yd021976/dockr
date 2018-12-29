import { UserModel } from "./user.model";
import { TemplatesModel } from "./templates.model";

export class ApplicationStateModel {
    // isProgress:boolean; // Indicates something in progress (login, performing long action ...)
    // isLoggedIn:boolean; // Is a user logged in (except for anonymous that are considered as not logged in users)
    user:UserModel
    templates:TemplatesModel
}