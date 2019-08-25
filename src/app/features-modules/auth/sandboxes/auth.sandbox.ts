import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { Store, Select } from "@ngxs/store";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { AppLoggerServiceInterface } from "../../../shared/services/logger/app-logger/service/app-logger.service";
import { AuthSandboxInterface } from "./auth.sandbox.interface";
import { loginCredentials, UserModelBase } from "../../../shared/models/user.model";
import { User_Action_Login, User_Action_Login_Success, User_Action_Login_Error, User_Action_Logout_Success, User_Action_Logout_Error } from "../../../shared/store/actions/user.actions";
import { ApplicationState } from "../../../shared/store/states/application.state";
import { AppLoggerServiceToken } from "../../../shared/services/logger/app-logger/app-logger-token";

@Injectable( { providedIn: 'root' } )
export class AuthSandbox extends AuthSandboxInterface {
    protected readonly loggerName: string = "AuthSandbox";

    @Select( ApplicationState.authError ) public authError$: Observable<string>

    constructor(
        store: Store,
        @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerServiceInterface,
        protected authService: AuthService
    ) {
        super( store, loggerService, authService )
        this.loggerService.createLogger( this.loggerName )
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
                .then( ( user: UserModelBase ) => {
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
