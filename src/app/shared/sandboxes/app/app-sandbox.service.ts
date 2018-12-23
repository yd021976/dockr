import { Injectable, Inject } from '@angular/core';
import { Store } from '@ngxs/store';

import { AuthService } from '../../services/auth/auth.service';
import { NotificationBaseService } from '../../services/notifications/notifications-base.service';
import { BaseSandboxService } from '../base-sandbox.service';
import { UserLoginSuccessAction, UserLogoutSuccessAction } from '../../store/actions/user.actions';
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

        // Update store when user logs in/out
        this.authService.user$.subscribe((user: UserBackendApiModel) => {
            if (user != null) {
                this.store.dispatch(new UserLoginSuccessAction(user))
            } else {
                this.store.dispatch(new UserLogoutSuccessAction())
            }
        })
    }
}