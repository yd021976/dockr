import { AppError } from "../../models/app-error.model";

/**
 * Append error to the end of state
 */
export class ApplicationError_Append_Error {
    static readonly type = "[Application Error] Add error action"
    public constructor( public error: AppError ) { }
}

/**
 * Remove first error from state
 */
export class ApplicationError_Shift_Error {
    static readonly type = "[Application Error] Add shift action"
    public constructor( ) { }
}