import { Injectable, Inject, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from "../logger/app-logger/service/app-logger.service";
import { FeathersjsBackendService } from "../backend_API_Endpoints/socketio/backend-feathers.service";
import { loginCredentials, UserBackendApiModel, UserModelBase } from "../../../shared/models/user.model";
import { errorType, AppError } from '../../models/application.error.model';
import { BackendStateChangeReasons } from "../../models/backend.connection.state.model";

export enum AuthenticateEventTypes {
    NOEVENT,
    LOGOUT,
    LOGIN,
    EXPIRED
}
export type AuthenticateEvent = {
    user: UserModelBase,
    event: AuthenticateEventTypes
}
/**
 * 
 */
@Injectable( { providedIn: 'root' } )
export class AuthService {
    private readonly loggerName: string = "[AuthService]";
    public user$: BehaviorSubject<AuthenticateEvent>;
    public sessionExpired: EventEmitter<boolean> = new EventEmitter<boolean>() // Event emitter when feathers publish "user-token-expired" event

    constructor(
        @Inject( AppLoggerServiceToken ) protected logger: AppLoggerService,
        protected feathersBackend: FeathersjsBackendService) {

        this.user$ = new BehaviorSubject<AuthenticateEvent>( { user: null, event: AuthenticateEventTypes.NOEVENT } );
        this.logger.createLogger( this.loggerName );

        // Handle token expiration (i.e. User session expired)
        this.feathersBackend.connectionState$.subscribe( ( state ) => {
            if ( state.changeReason == BackendStateChangeReasons.Feathers_Token_Expired ) {
                this.user$.next( { user: null, event: AuthenticateEventTypes.EXPIRED } )
                this.sessionExpired.emit( true )
            }
        } )
    }

    /**
     * This authenticate method should ensure one call at a time and AVOID parallel call to authenticate
     * 
     * @param credentials Login credentials
     */
    public authenticate( credentials?: loginCredentials ): Promise<UserModelBase> {
        return this.feathersBackend.authenticate( credentials )
            .then( ( user: UserModelBase ) => {
                this.user$.next( { user: user, event: AuthenticateEventTypes.LOGIN } )
                this.logger.debug( this.loggerName, { message: 'authenticate() success', otherParams: [ credentials ] } );
                return user
            } )
            .catch( ( error ) => {
                this.logger.debug( this.loggerName, { message: 'authenticate() error', otherParams: [ credentials, error ] } );
                throw new AppError( error.message, errorType.backendError, error );
            } )
    }

    /**
     * 
     */
    public logout(): Promise<void> {
        return this.feathersBackend.logout()
            .then( () => {
                this.logger.debug( this.loggerName, { message: 'logout() success', otherParams: [] } );

                // Update observable only if user is not already set to null
                if ( this.user$.getValue() != null ) this.user$.next( { user: null, event: AuthenticateEventTypes.LOGOUT } )
            } )
            .catch( ( error ) => {
                this.logger.debug( this.loggerName, { message: 'logout() error', otherParams: [ error ] } );
                throw new AppError( error.message, errorType.backendError, error );
            } )
    }

}