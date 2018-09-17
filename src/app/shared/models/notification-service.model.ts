export enum notificationType {
    success,
    error,
    alert,
    info
}
export enum notificationAction {
    add,
    update,
    remove
}

export class Notification {
    id: string;
    type: notificationType;
    action : notificationAction;
    message: string;
    isRead?: boolean;

    constructor(notification: Notification) {
        Object.assign(this, notification);
    }
}