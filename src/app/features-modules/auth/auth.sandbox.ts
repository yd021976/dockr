import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { Store, Select } from "@ngxs/store";

import { ApplicationState } from "../../shared/store/states/application.state";
import { AuthService } from "../../shared/services/auth/auth.service";
import { loginCredentials } from "../../shared/models/user.model";
import { NotificationBaseService } from "../../shared/services/notifications/notifications-base.service";
import { BaseSandboxService } from "../../shared/sandboxes/base-sandbox.service";
import { User_Action_Login, User_Action_Login_Error, User_Action_Login_Success, User_Action_Logout_Success, User_Action_Logout_Error } from "../../shared/store/actions/user.actions";
import { AppLoggerServiceToken } from "src/app/shared/services/logger/app-logger/app-logger-token";
import { AppLoggerService } from "src/app/shared/services/logger/app-logger/service/app-logger.service";
import { ApplicationNotifications_Append_Message } from "src/app/shared/store/actions/application-notifications.actions";
import { AppError, errorType } from "src/app/shared/models/app-error.model";
import { ApplicationNotification, ApplicationNotificationType } from "src/app/shared/models/acl2/application.notifications.model";


@Injectable()
export class AuthSandbox extends BaseSandboxService {
    private readonly loggerName: string = "AuthSandbox";
    // Keep track of previous server connection state
    private currentIsConnected: boolean = false;

    @Select( ApplicationState.authError ) public authError$: Observable<string>;

    constructor(
        protected authService: AuthService,
        @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerService,
        store: Store,
        protected router: Router
    ) {
        super( store, loggerService );
        this.loggerService.createLogger( this.loggerName );

        // get notifications about session expired
        this.authService.sessionExpired.subscribe( ( state ) => {
            if ( state == true ) {
                this.store.dispatch( new ApplicationNotifications_Append_Message( new ApplicationNotification( 'Session expired', 'not authenticated', ApplicationNotificationType.WARNING ) ) )

                // Ensure store is up to date with logout user
                this.store.dispatch( new User_Action_Logout_Success() )
            }
        } )
    }

    public Login( credentials?: loginCredentials ): Promise<boolean> {
        return new Promise<boolean>( ( resolve, reject ) => {
            this.doLogin( credentials ).then( () => resolve( true ) ).catch( () => resolve( false ) );
        } );
    }
    private doLogin( credentials: loginCredentials ) {
        this.loggerService.debug( this.loggerName, { message: 'login()', otherParams: [ 'START', credentials ] } );
        this.store.dispatch( new User_Action_Login() );

        // We must logout current user before authenticate again (FeathersJS can't auth if a JWT exist)
        return this.logout().then( () => {
            return this.authService.authenticate( credentials )
                .then( ( user ) => {
                    this.store.dispatch( new User_Action_Login_Success( user ) )
                    this.loggerService.debug( this.loggerName, { message: 'login()', otherParams: [ 'END', 'OK', user ] } );
                } )
                .catch( ( error ) => {
                    this.store.dispatch( new User_Action_Login_Error( error.message ) );
                    this.loggerService.debug( this.loggerName, { message: 'login()', otherParams: [ 'END', 'ERROR', error ] } );
                    throw error;
                } )
        } )
    }
    public logout(): Promise<void> {
        this.loggerService.debug( this.loggerName, { message: 'logout()', otherParams: [ 'START' ] } );
        return this.authService.logout()
            .then( () => {
                this.loggerService.debug( this.loggerName, { message: 'logout()', otherParams: [ 'END', 'OK' ] } );
                this.store.dispatch( new User_Action_Logout_Success() )
            } )
            .catch( ( error ) => {
                this.loggerService.debug( this.loggerName, { message: 'logout()', otherParams: [ 'END', 'ERROR', error ] } );
                this.store.dispatch( new User_Action_Logout_Error( error.message ) )
            } )
    }
}
