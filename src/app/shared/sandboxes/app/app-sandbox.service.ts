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
import { AppNotificationsState } from '../../store/states/application.notifications.state';
import { ApplicationNotification } from '../../models/acl2/application.notifications.model';

@Injectable()
export class AppSandboxService extends BaseSandboxService {
    private static loginCount: number = 0
    private readonly loggerName: string = "AppSandboxService";
    @Select( AppNotificationsState.notifications$ ) private notifications: Observable<ApplicationNotification[]>

    constructor(
        @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerService,
        public authservice: AuthService,
        protected store: Store
    ) {
        super( store, loggerService );
    }
    /**
     * State selectors
     */
    public getNotifications$() {
        return this.notifications
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