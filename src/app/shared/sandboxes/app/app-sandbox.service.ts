import { Injectable, Inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { NotificationBaseService } from '../../services/notifications/notifications-base.service';
import { BaseSandboxService } from '../base-sandbox.service';
import { User_Action_Login_Success, User_Action_Logout_Success, User_Action_Login } from '../../store/actions/user.actions';
import { UserBackendApiModel } from '../../models/user.model';
import { Observable } from 'rxjs';
import { ApplicationState } from '../../store/states/application.state';
import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../services/logger/app-logger/service/app-logger.service';
import { Store, Select } from '@ngxs/store';
import { AppErrorsState } from '../../store/states/errors.state';

@Injectable()
export class AppSandboxService extends BaseSandboxService {
    private static loginCount: number = 0
    private readonly loggerName: string = "AppSandboxService";
    @Select( AppErrorsState.errorsList$ ) private errors$: Observable<string[]>

    constructor(
        notificationService: NotificationBaseService,
        @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerService,
        public authservice: AuthService,
        protected store: Store
    ) {
        super( notificationService, store, loggerService );
    }
    /**
     * State selectors
     */
    public getErrors$() {
        return this.errors$
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

        this.store.dispatch( new User_Action_Login() )
        return this.authservice.authenticate()
            .then( ( user ) => {
                this.store.dispatch( new User_Action_Login_Success( user ) )
            } )
            .catch( ( error ) => {
                this.store.dispatch( new User_Action_Login_Success( null ) )
            } )
    }
}