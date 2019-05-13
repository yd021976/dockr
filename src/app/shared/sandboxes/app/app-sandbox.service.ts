import { Injectable, Inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { NotificationBaseService } from '../../services/notifications/notifications-base.service';
import { BaseSandboxService } from '../base-sandbox.service';
import { UserLoginSuccessAction, UserLogoutSuccessAction, UserLoginAction } from '../../store/actions/user.actions';
import { UserBackendApiModel } from '../../models/user.model';
import { Observable } from 'rxjs';
import { ApplicationState } from '../../store/states/application.state';
import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../services/logger/app-logger/service/app-logger.service';
import { Store } from '@ngxs/store';

@Injectable()
export class AppSandboxService extends BaseSandboxService {
    private static loginCount: number = 0
    private readonly loggerName: string = "AppSandboxService";

    constructor(
        notificationService: NotificationBaseService,
        @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerService,
        public authservice: AuthService,
        protected store: Store
    ) {

        super( notificationService, store, loggerService );
    }

    /**
     * Login user
     * 
     * IMPORTANT: should be called only once at application startup
     */
    public login(): Promise<any> {
        // Ensure login is called only once
        AppSandboxService.loginCount = AppSandboxService.loginCount + 1
        if ( AppSandboxService.loginCount > 1 ) return

        this.store.dispatch( new UserLoginAction() )
        return this.authservice.authenticate()
            .then( ( user ) => {
                this.store.dispatch( new UserLoginSuccessAction( user ) )
            } )
            .catch( ( error ) => {
                this.store.dispatch( new UserLoginSuccessAction( null ) )
            } )
    }
}