export class Application_Event_Error{
    static readonly type = '[Application] Error event'
    constructor(public error:Error) {}
}