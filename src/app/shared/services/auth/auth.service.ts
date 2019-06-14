import { Injectable, Inject, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from "../logger/app-logger/service/app-logger.service";
import { FeathersjsBackendService } from "../backend_API_Endpoints/socketio/backend-feathers.service";
import { loginCredentials, UserBackendApiModel } from "../../../shared/models/user.model";
import { NotificationBaseService } from "../../../shared/services/notifications/notifications-base.service";
import { errorType, AppError } from '../../models/app-error.model';
import { stateChangeReason } from "../../models/backend-service-connection-state.model";
/**
 * 
 */
@Injectable( { providedIn: 'root' } )
export class AuthService {
    private readonly loggerName: string = "[AuthService]";
    public user$: BehaviorSubject<UserBackendApiModel | null>;
    public sessionExpired: EventEmitter<boolean> = new EventEmitter<boolean>()

    constructor(
        @Inject( AppLoggerServiceToken ) protected logger: AppLoggerService,
        protected feathersBackend: FeathersjsBackendService,
        protected notificationService: NotificationBaseService ) {

        this.user$ = new BehaviorSubject<UserBackendApiModel | null>( null );
        this.logger.createLogger( this.loggerName );

        // Handle token expiration (i.e. User session expired)
        this.feathersBackend.connectionState$.subscribe( ( state ) => {
            if ( state.changeReason == stateChangeReason.Feathers_Token_Expired ) {
                this.user$.next( null )
                this.sessionExpired.emit( true )
            }
        } )
    }

    /**
     * This authenticate method should ensure one call at a time and AVOID parallel call to authenticate
     * 
     * @param credentials Login credentials
     */
    public authenticate( credentials: loginCredentials = null ): Promise<UserBackendApiModel> {
        if ( credentials == null ) return this.feathersBackend.authenticate()

        return this.feathersBackend.authenticate( credentials )
            .then( ( user ) => {
                this.user$.next( user )
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
                if ( this.user$.getValue() != null ) this.user$.next( null )
            } )
            .catch( ( error ) => {
                this.logger.debug( this.loggerName, { message: 'logout() error', otherParams: [ error ] } );
                throw new AppError( error.message, errorType.backendError, error );
            } )
    }

}