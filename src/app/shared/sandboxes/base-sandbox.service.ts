import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { Select, Store } from "@ngxs/store";

import { BackendServiceConnectionState } from '../models/backend-service-connection-state.model';
import { NotificationBaseService } from '../services/notifications/notifications-base.service';
import { ApplicationState } from "../store/states/application.state";

@Injectable()
export abstract class BaseSandboxService {
    public ApiServiceConnectionState$: BehaviorSubject<BackendServiceConnectionState>;
    isLoggedin$: Observable<boolean> = ApplicationState.isLoggedin$;
    @Select(ApplicationState.isProgress) isProgress$: Observable<boolean>;

    constructor(public notificationService: NotificationBaseService, protected store: Store, protected loggerService: any) { }
}