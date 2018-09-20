import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { Notification, notificationAction, notificationType } from '../../models/notification-service.model';

@Injectable({ providedIn: 'root' })
/**
 * Base notification service
 */
export class NotificationBaseService {
    private _notifications: Map<string, Notification>;
    public notifications$: ReplaySubject<Notification>;

    constructor() {
        this._notifications = new Map<string, Notification>();
        this.notifications$ = new ReplaySubject<Notification>();
    }

    /**
     * get the notifications list as iterator
     */
    public get notifications(): IterableIterator<[string, Notification]> {
        return this._notifications.entries();
    }
    public addNotification(type: notificationType, message: string) {
        const id: string = uuid();
        const newNotification = new Notification({ id: id, type: type, action: notificationAction.add, message: message, isRead: false });

        this._notifications.set(id, newNotification);
        this.notifyNotificationChanges(newNotification);
    }
    public removeNotification(notification: Notification) {
        var notificationToRemove = this._notifications.get(notification.id);
        if (notificationToRemove) {
            notificationToRemove.action = notificationAction.remove;
            this.notifyNotificationChanges(notificationToRemove);
            this._notifications.delete(notification.id);
        }
    }

    public updateNotification(notification: Notification) {
        this._notifications.set(notification.id, notification);
        this.notifyNotificationChanges(notification);
    }

    /**
     * 
     * @param notification New/updated/removed notification
     */
    private notifyNotificationChanges(notification: Notification) {
        this.notifications$.next(notification);
    }
}