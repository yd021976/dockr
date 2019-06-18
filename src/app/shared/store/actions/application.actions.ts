export class Application_Event_Notification{
    static readonly type = '[Application] Notification event'
    // TODO: change Notification type "error" to something else
    constructor(public Notification:Error) {}
}