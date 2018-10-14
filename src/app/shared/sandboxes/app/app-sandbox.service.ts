import { Injectable, Inject } from '@angular/core';
import { Store } from '@ngxs/store';

import { AuthService } from '../../services/auth/auth.service';
import { NotificationBaseService } from '../../services/notifications/notifications-base.service';
import { BaseSandboxService } from '../base-sandbox.service';
import { UserLoginSuccessAction } from '../../store/actions/user.actions';
import { UserBackendApiModel } from '../../models/user.model';
import { Observable } from 'rxjs';
import { ApplicationState } from '../../store/states/application.state';
import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../services/logger/app-logger/service/app-logger.service';

@Injectable()
export class AppSandboxService extends BaseSandboxService {
    private readonly loggerName: string = "AppSandboxService";

    constructor(
        /** IMPORTANT: The auth service MUST be imported at the root sandbox/component to make app auth tracking work properly */
        protected authService: AuthService,
        notificationService: NotificationBaseService,
        store: Store,
        @Inject(AppLoggerServiceToken) public loggerService: AppLoggerService) {
        super(notificationService, store, loggerService);

        // Update store when authService authenticate user (ONLY when application starts)
        this.authService.initialAuthentication$.subscribe((user: UserBackendApiModel) => {
            if (user != null) {
                this.store.dispatch(new UserLoginSuccessAction(user));
            }
        })
    }
}