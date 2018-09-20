import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

import { BackendServiceConnectionState } from '../models/backend-service-connection-state.model';
import { NotificationBaseService } from '../services/notifications/notifications-base.service';

@Injectable()
export abstract class SandboxBaseService {
    public ApiServiceConnectionState$: Observable<BackendServiceConnectionState>;
    public isAuthenticated$: BehaviorSubject<boolean>;

    constructor(public notificationService: NotificationBaseService) {
        this.isAuthenticated$ = new BehaviorSubject<boolean>(false);
    }

    navigateLogin() { }
    navigateLogout() { }
}