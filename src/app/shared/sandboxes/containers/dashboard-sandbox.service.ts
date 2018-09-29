import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';

import { NotificationBaseService } from '../../services/notifications/notifications-base.service';
import { BaseSandboxService } from '../base-sandbox.service';
import { TemplatesService } from '../../services/templates/templates.service';
import { TemplatesLoadAction, TemplatesLoadSuccessAction, TemplatesLoadErrorAction, TemplateLoadReset } from '../../store/actions/templates.actions';
import { UserLoginErrorAction } from '../../store/actions/user.actions';
import { FeathersjsBackendService } from '../../services/backend/socketio/backend-feathers.service';
import { AuthService } from '../../services/auth/auth.service';
import { AppError, errorType } from '../../models/app-error.model';

@Injectable()
export class DashboardSandbox extends BaseSandboxService {
    constructor(
        protected templatesService: TemplatesService,
        notificationService: NotificationBaseService,
        store: Store,
        logger: NGXLogger,
        protected backend: FeathersjsBackendService,
        private authService: AuthService) {

        super(notificationService, store, logger);
    }


    public getTemplates(): Promise<any> {
        this.store.dispatch(new TemplatesLoadAction());

        return this.authService.checkSessionActive()
            .then(() => {
                this.templatesService.find()
                    .then((templates) => {
                        this.logger.debug('[DashboardSandbox]', 'getTemplates()', 'SUCCESS', templates.data);
                        this.store.dispatch(new TemplatesLoadSuccessAction(templates.data));
                    })
                    .catch((error) => {
                        this.logger.debug('[DashboardSandbox]', 'getTemplates()', 'ERROR', error);
                        switch (error.name) {
                            case "notAuthenticated":
                                this.store.dispatch([new TemplateLoadReset(), new UserLoginErrorAction(error.message)]);
                                break;
                            default:
                                this.store.dispatch(new TemplatesLoadErrorAction(error.message));
                                break;
                        }
                    })
            })
            .catch((error) => {
                switch (error.type) {
                    case errorType.notAuthenticated:
                    case errorType.sessionExpired:
                        break;
                    default:
                        break;
                }
            })


    }
    public isAuth() {
        return this.backend.isAuth();
    }
}