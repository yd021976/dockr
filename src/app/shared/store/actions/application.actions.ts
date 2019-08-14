import { ApplicationNotification } from "../../models/application.notifications.model";

export class Application_Event_Notification{
    static readonly type = '[Application] Notification event'
    constructor(public Notification:ApplicationNotification) {}
}