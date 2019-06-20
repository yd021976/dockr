export enum ApplicationNotificationType {
    INFO,
    WARNING,
    ERROR
}
export class ApplicationNotification {
    type: ApplicationNotificationType
    name: string
    message: string
    constructor( message: string, name: string, type: ApplicationNotificationType = ApplicationNotificationType.INFO ) {
        this.message = message
        this.type = type
        this.name = name
    }
}

export class ApplicationNotificationsModel {
    notifications: ApplicationNotification[]
}