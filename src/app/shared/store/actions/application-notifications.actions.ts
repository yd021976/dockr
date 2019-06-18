import { AppError } from "../../models/app-error.model";

/**
 * Append error to the end of state
 */
export class ApplicationNotifications_Append_Message {
    static readonly type = "[Application Notifications] Add error action"
    public constructor( public error: AppError ) { }
}

/**
 * Remove first error from state
 */
export class ApplicationNotifications_Shift_Message {
    static readonly type = "[Application Notifications] Add shift action"
    public constructor( ) { }
}