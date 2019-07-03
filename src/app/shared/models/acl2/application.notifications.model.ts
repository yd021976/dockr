export enum ApplicationNotificationType {
    INFO,
    WARNING,
    ERROR
}
export class ApplicationNotification {
    type: ApplicationNotificationType
    name: string
    message: string
    ttl: number = 10000 // Message time to live 
    private timeoutFn // Timeout callback when ttl is reached
    /**
     * Constructor
     * @param message 
     * @param name 
     * @param type 
     */
    constructor( message: string, name: string, type: ApplicationNotificationType = ApplicationNotificationType.INFO, ttl: number = 10000 ) {
        this.message = message
        this.type = type
        this.name = name
    }
}

export class ApplicationNotificationsModel {
    notifications: ApplicationNotification[]
}