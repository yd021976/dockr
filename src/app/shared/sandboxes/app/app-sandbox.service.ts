import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Store, Select } from '@ngxs/store';

import { AuthService } from '../../services/auth/auth.service';
import { NotificationBaseService } from '../../services/notifications/notifications-base.service';
import { BaseSandboxService } from '../base-sandbox.service';
import { UserLoginSuccessAction } from '../../store/actions/user.actions';
import { UserBackendApiModel } from '../../models/user.model';
import { Observable } from 'rxjs';
import { ApplicationState } from '../../store/states/application.state';

@Injectable()
export class AppSandboxService extends BaseSandboxService {
    constructor(
        /** IMPORTANT: The auth service MUST be imported at the root sandbox/component to make app auth tracking work properly */
        protected authService: AuthService, 
        notificationService: NotificationBaseService,
        store: Store,
        logger: NGXLogger) {
        super(notificationService, store, logger);

        // Update store when authService authenticate user (ONLY when application starts)
        this.authService.initialAuthentication$.subscribe((user: UserBackendApiModel) => {
            if (user != null) {
                this.store.dispatch(new UserLoginSuccessAction(user));
            }
        })
    }
}