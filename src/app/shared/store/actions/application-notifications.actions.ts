import { ApplicationNotification } from "../../models/acl2/application.notifications.model";

/**
 * Append error to the end of state
 */
export class ApplicationNotifications_Append_Message {
    static readonly type = "[Application Notifications] Add notification"
    public constructor( public notification: ApplicationNotification ) { }
}

/**
 * Remove first error from state
 */
export class ApplicationNotifications_Shift_Message {
    static readonly type = "[Application Notifications] Shift message"
    public constructor() { }
}

export class ApplicationNotifications_Remove_Message {
    static readonly type = "[Application Notifications] Remove message"
    public constructor( public message_index: number ) { }
}