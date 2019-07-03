import { Injectable, Inject } from '@angular/core';
import { Store } from '@ngxs/store';

import { NotificationBaseService } from '../../services/notifications/notifications-base.service';
import { BaseSandboxService } from '../base-sandbox.service';
import { TemplatesService } from '../../services/templates/templates.service';
import { TemplatesLoadAction, TemplatesLoadSuccessAction, TemplatesLoadErrorAction, TemplateLoadReset } from '../../store/actions/templates.actions';
import { User_Action_Login_Error } from '../../store/actions/user.actions';
import { FeathersjsBackendService } from '../../services/backend_API_Endpoints/socketio/backend-feathers.service';
import { AuthService } from '../../services/auth/auth.service';
import { AppError, errorType } from '../../models/app-error.model';
import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../services/logger/app-logger/service/app-logger.service';

@Injectable()
export class DashboardSandbox extends BaseSandboxService {
    private readonly loggerName: string = "DashboardSandbox";

    constructor(
        protected templatesService: TemplatesService,
        store: Store,
        @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerService,
        protected backend: FeathersjsBackendService,
        private authService: AuthService ) {

        super( store, loggerService );
        this.loggerService.createLogger( this.loggerName );
    }


    public getTemplates(): Promise<any> {
        this.store.dispatch( new TemplatesLoadAction() );

        return this.templatesService.find()
            .then( ( templates ) => {
                this.loggerService.debug( this.loggerName, { message: 'getTemplates()', otherParams: [ 'SUCCESS', templates.data ] } );
                this.store.dispatch( new TemplatesLoadSuccessAction( templates.data ) );
            } )
            .catch( ( error ) => {
                this.loggerService.debug( this.loggerName, { message: 'getTemplates()', otherParams: [ 'ERROR', error ] } );
                switch ( error.name ) {
                    case "notAuthenticated":
                        this.store.dispatch( [ new TemplateLoadReset(), new User_Action_Login_Error( error.message ) ] );
                        break;
                    default:
                        this.store.dispatch( new TemplatesLoadErrorAction( error.message ) );
                        break;
                }
            } )
    }
    public isAuth() {
        return this.backend.isAuth();
    }
}