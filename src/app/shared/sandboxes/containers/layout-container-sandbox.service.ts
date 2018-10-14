import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';

import { ApplicationState } from '../../store/states/application.state';
import { FeathersjsBackendService } from '../../services/backend/socketio/backend-feathers.service';
import { NotificationBaseService } from '../../services/notifications/notifications-base.service';
import { BaseSandboxService } from '../base-sandbox.service';
import { UserModel } from '../../models/user.model';
import { AppLoggerService } from '../../services/logger/app-logger/service/app-logger.service';
import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token';

@Injectable()
export class LayoutContainerSandboxService extends BaseSandboxService {
    private readonly loggerName: string = "LayoutContainerSandboxService"

    @Select(ApplicationState.getCurrentUser) public currentUser$: Observable<UserModel>;

    constructor(
        private feathers: FeathersjsBackendService,
        notificationService: NotificationBaseService,
        @Inject(AppLoggerServiceToken) public loggerService: AppLoggerService,
        store: Store,
        private router: Router
    ) {
        super(notificationService, store, loggerService);
        this.loggerService.createLogger(this.loggerName);
        this.ApiServiceConnectionState$ = this.feathers.connectionState$;
    }

    // TODO: hard coded route => Find a better way to get route to login page
    navigateLogin() {
        this.router.navigate(['auth/login']);
    }

    //TODO: hard coded route => Find a better way to get route to login page
    navigateLogout() {
        this.router.navigate(['auth/logout']);
    }
}