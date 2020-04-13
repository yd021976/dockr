import { Injectable, Inject, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UserModel } from '../../../shared/models/user.model';
import {AuthenticationResult} from '@feathersjs/authentication';
import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from "../logger/app-logger/service/app-logger.service";
import { loginCredentials } from "../../../shared/models/user.model";
import { errorType, AppError } from '../../models/application.error.model';
import { BackendStateChangeReasons } from "../../models/backend.connection.state.model";
import { BackendServiceToken } from "../backend.api.endpoint/backend.service.token";
import { BackendBaseServiceInterface } from "../backend.api.endpoint/interfaces/backend.base.service";

export enum AuthenticateEventTypes {
    NOEVENT,
    LOGOUT,
    LOGIN,
    EXPIRED
}
export type AuthenticateEvent = {
    user: UserModel,
    event: AuthenticateEventTypes
}
/**
 * 
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly loggerName: string = "[AuthService]";
    public user$: BehaviorSubject<AuthenticateEvent>;
    public sessionExpired: EventEmitter<boolean> = new EventEmitter<boolean>() // Event emitter when feathers publish "user-token-expired" event

    constructor(
        @Inject(AppLoggerServiceToken) protected logger: AppLoggerService,
        @Inject(BackendServiceToken) protected feathersBackend: BackendBaseServiceInterface) {

        this.user$ = new BehaviorSubject<AuthenticateEvent>({ user: null, event: AuthenticateEventTypes.NOEVENT });
        this.logger.createLogger(this.loggerName);

        // Handle token expiration (i.e. User session expired)
        this.feathersBackend.connectionState$.subscribe((state) => {
            if (state.changeReason == BackendStateChangeReasons.Feathers_Token_Expired) {
                this.user$.next({ user: null, event: AuthenticateEventTypes.EXPIRED })
                this.sessionExpired.emit(true)
            }
        })
    }

    /**
     * This authenticate method should ensure one call at a time and AVOID parallel call to authenticate
     * 
     * @param credentials Login credentials
     */
    public authenticate(credentials?: loginCredentials): Promise<UserModel> {
        return this.feathersBackend.authenticate(credentials)
            .then((authentication_data: AuthenticationResult) => {
                this.user$.next({ user: authentication_data.user, event: AuthenticateEventTypes.LOGIN })
                this.logger.debug(this.loggerName, { message: 'authenticate() success', otherParams: [credentials] });
                return authentication_data.user
            })
            .catch((error) => {
                this.logger.debug(this.loggerName, { message: 'authenticate() error', otherParams: [credentials, error] });
                throw new AppError(error.message, errorType.backendError, error);
            })
    }

    /**
     * 
     */
    public reAuthenticate(): Promise<UserModel> {
        return this.feathersBackend.reAuthenticate()
            .then((authentication_data) => {
                this.user$.next({ user: authentication_data.user, event: AuthenticateEventTypes.LOGIN })
                this.logger.debug(this.loggerName, { message: 'authenticate() success', otherParams: [] });
                return authentication_data.user
            })
            .catch((err) => {
                this.logger.debug(this.loggerName, { message: 'reAuthenticate() error', otherParams: [err] })
                throw new AppError(err.message, errorType.backendError, err)
            })
    }
    /**
     * 
     */
    public logout(): Promise<void> {
        return this.feathersBackend.logout()
            .then(() => {
                this.logger.debug(this.loggerName, { message: 'logout() success', otherParams: [] });

                // Update observable only if user is not already set to null
                if (this.user$.getValue() != null) this.user$.next({ user: null, event: AuthenticateEventTypes.LOGOUT })
            })
            .catch((error) => {
                this.logger.debug(this.loggerName, { message: 'logout() error', otherParams: [error] });
                throw new AppError(error.message, errorType.backendError, error);
            })
    }

}