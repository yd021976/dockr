import { Injectable, Inject } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from "../logger/app-logger/service/app-logger.service";
import { BackendServiceConnectionState } from '../../../shared/models/backend-service-connection-state.model';
import { FeathersjsBackendService } from "../../../shared/services/backend/socketio/backend-feathers.service";
import { loginCredentials, UserBackendApiModel, UserModel } from "../../../shared/models/user.model";
import { NotificationBaseService } from "../../../shared/services/notifications/notifications-base.service";
import { stateChangeReason } from '../../../shared/models/backend-service-connection-state.model';
import { errorType, AppError } from '../../models/app-error.model';
/**
 * 
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly loggerName: string = "[AuthService]";
    private ApiServiceConnectionState$: Observable<BackendServiceConnectionState>;
    private currentIsConnected: boolean = false;
    public user$: BehaviorSubject<UserBackendApiModel | null>;

    constructor(
        @Inject(AppLoggerServiceToken) protected logger: AppLoggerService,
        protected feathersBackend: FeathersjsBackendService,
        protected notificationService: NotificationBaseService) {

        this.ApiServiceConnectionState$ = this.feathersBackend.connectionState$;
        this.user$ = new BehaviorSubject<UserBackendApiModel | null>(null);
        this.logger.createLogger(this.loggerName);

        // // Subscribe to connection change state to auto authenticate user
        // this.ApiServiceConnectionState$.subscribe(state => {
        //     /**
        //      *  Handle feathers JS connections and re-auth events
        //      */
        //     this.updateUserState(state);

        //     // We should try to re-auth user after a restored socketIO connection or at first socketIO connection
        //     if (state.isConnected && this.currentIsConnected == false) {
        //         this.authUser().catch((error) => {
        //             let a = 0;
        //         }) // we must handle catch here to avoid unhandled promise errors
        //         this.currentIsConnected = state.isConnected;

        //     }
        // })
    }

    /**
     * This authenticate method should ensure one call at a time and AVOID parallel call to authenticate
     * 
     * @param credentials Login credentials
     */
    public authenticate(credentials: loginCredentials = null): Promise<UserBackendApiModel> {
        return this.feathersBackend.authenticate(credentials)
            .then((user) => {
                this.user$.next(user)
                this.logger.debug(this.loggerName, { message: 'authenticate() success', otherParams: [credentials] });
                return user
            })
            .catch((error) => {
                this.logger.debug(this.loggerName, { message: 'authenticate() error', otherParams: [credentials, error] });
                throw new AppError(error.message, errorType.backendError, error);
            })
        }
        
        /**
         * 
         */
        public logout(): Promise<void> {
            return this.feathersBackend.logout()
            .then(() => {
                this.logger.debug(this.loggerName, { message: 'logout() success', otherParams: [] });
                this.user$.next(null)
            })
            .catch((error) => {
                this.logger.debug(this.loggerName, { message: 'logout() error', otherParams: [error] });
                throw new AppError(error.message, errorType.backendError, error);
            })
        }
        
        /**
         * 
         * Before any service call, we need to check that a valid JWT exist.
         * If JWT is invalid and last user was anonymous, try to authenticate as anonymous
         * else throw error
         * 
         * @Return
         * - True : Current JWT is valid
         * - False : Current JWT is not valid AND re-auth as anonymous successfull
         * - Throws error : If JWT is invalid and can't auth as anonymous because previously logged-in as a real user OR server error 
         * 
         **/
        public checkSessionActive(): Promise<boolean> {
            this.logger.debug(this.loggerName, { message: 'checkSessionActive()', otherParams: [] });
            
            // get current/Last logged in user
            const currentLoggedInUser = this.feathersBackend.getCurrentUser();
            
            return this.feathersBackend.isAuth()
            .then((isAuth) => {
                if (isAuth) {
                    return true;
                } else {
                    // if last user was anonymous, silently re-auth as anonymous
                    if (currentLoggedInUser == null || (currentLoggedInUser != null && currentLoggedInUser['anonymous'])) {
                        return this.feathersBackend.authenticate({ strategy: 'anonymous' })
                            .then((user) => {
                                this.user$.next(user)
                                return false;
                            })
                            .catch((error) => {
                                throw new AppError(error.message, errorType.backendError, error);
                            })
                    } else {
                        // JWT has expired and user was not anonymous, throw an error because we can't automatically re-auth without credentials
                        throw new AppError("Session has expired", errorType.sessionExpired);
                    }
                }
            })
    }
    /**
    * (re) Authenticate user with existing stored token. If not, auth as anonymous
    */
    protected authUser(): Promise<UserBackendApiModel> {
        this.logger.debug(this.loggerName, { message: 'authUser()', otherParams: ['START'] });
        return this.feathersBackend.isAuth()
            .then(isAuth => {
                // No valid token to auto authenticate user ==> Authenticate user as anonymous by default
                if (isAuth == false) {
                    this.logger.debug(this.loggerName, { message: 'authUser()', otherParams: ['Authenticate as Anonymous', 'PROGRESS', isAuth] });
                    return this.authenticate({ strategy: "anonymous" })
                        .then((user: UserBackendApiModel) => {
                            this.logger.debug(this.loggerName, { message: 'authUser()', otherParams: ['Authenticate as Anonymous', 'END', 'OK', user] });
                            this.user$.next(user);
                            return user;
                        })
                        .catch((error) => {
                            this.logger.debug(this.loggerName, { message: 'authUser()', otherParams: ['Authenticate as Anonymous', 'END', 'ERROR', error] });
                            throw new AppError(error.message, errorType.backendError, error);
                        })
                } else {
                    // try to authenticate with current valid token
                    this.logger.debug(this.loggerName, { message: 'authUser()', otherParams: ['Try to re-auth last logged in user', 'PROGRESS', isAuth] });
                    return this.authenticate()
                        .then((user: UserBackendApiModel) => {
                            this.logger.debug(this.loggerName, { message: 'authUser()', otherParams: ['Try to re-auth last logged in user', 'END', 'OK', user] });
                            this.user$.next(user);
                            return user;
                        })
                        .catch((error) => {
                            this.logger.debug(this.loggerName, { message: 'authUser()', otherParams: ['Try to re-auth last logged in user', 'END', 'ERROR', error] });
                            throw new AppError(error.message, errorType.backendError, error);
                        })
                }
            })
            .catch((error) => {
                throw error
            })
    }
    /**
     * We should update USER state because of backend server events/state
     * @param state 
     */
    /* istanbul ignore next */
    private updateUserState(state: BackendServiceConnectionState) {

        switch (state.changeReason) {
            // Something went wrong with sicketIO connection
            case stateChangeReason.socketIO_Connection_Error:
                this.logger.debug(this.loggerName, { message: 'updateUserState()', otherParams: ['EVENT', 'stateChangeReason.socketIO_Connection_Error'] });
                break;
            case stateChangeReason.socketIO_connection_timeout:
                this.logger.debug(this.loggerName, { message: 'updateUserState()', otherParams: ['EVENT', 'stateChangeReason.socketIO_connection_timeout'] });
                break;

            case stateChangeReason.Feathers_Logout:
                this.logger.debug(this.loggerName, { message: 'updateUserState()', otherParams: ['EVENT', 'stateChangeReason.Feathers_Logout'] });
                break;
            // If token has expired, try to reconnect as anonymous
            case stateChangeReason.Feathers_reauthentication_error:
                this.logger.debug(this.loggerName, { message: 'updateUserState()', otherParams: ['EVENT', 'stateChangeReason.Feathers_reauthentication_error'] });
                break;
            default:
                break;
        }
    }
}