import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { Observable, BehaviorSubject } from "rxjs";

import { BackendServiceConnectionState } from '../../../shared/models/backend-service-connection-state.model';
import { FeathersjsBackendService } from "../../../shared/services/backend/socketio/backend-feathers.service";
import { loginCredentials, UserBackendApiModel, UserModel } from "../../../shared/models/user.model";
import { NotificationBaseService } from "../../../shared/services/notifications/notifications-base.service";
import { stateChangeReason } from '../../../shared/models/backend-service-connection-state.model';

/**
 * 
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
    private ApiServiceConnectionState$: Observable<BackendServiceConnectionState>;
    private currentIsConnected: boolean = false;
    public initialAuthentication$: BehaviorSubject<UserBackendApiModel>;

    constructor(protected logger: NGXLogger, protected feathersBackend: FeathersjsBackendService, protected notificationService: NotificationBaseService) {
        this.ApiServiceConnectionState$ = this.feathersBackend.connectionState$;
        this.initialAuthentication$ = new BehaviorSubject<UserBackendApiModel>(new UserBackendApiModel());

        // Subscribe to connection change state to auto authenticate user
        this.ApiServiceConnectionState$.subscribe(state => {
            /**
             *  Handle feathers JS connections and re-auth events
             */
            this.updateUserState(state);

            // We should try to re-auth user after a restored socketIO connection or at first socketIO connection
            if (state.isConnected && this.currentIsConnected == false) {
                this.authUser();
                this.currentIsConnected = state.isConnected;
            }
        })
    }

    /**
     * This authenticate methode should ensure one call at a time and AVOID parallel call to autheticate
     * 
     * @param credentials Login credentials
     */
    public authenticate(credentials?: loginCredentials): Promise<UserBackendApiModel> {
        this.logger.debug('[AuthService]', 'authenticate()', credentials);
        return this.feathersBackend.authenticate(credentials);
    }

    /**
     * 
     */
    public logout(): Promise<void> {
        this.logger.debug('[AuthService]', 'logout()');
        return this.feathersBackend.logout();

    }


    /**
    * (re) Authenticate user with existing stored token. If not, auth as anonymous
    */
    private authUser() {
        this.logger.debug('[AuthService]', 'authUser()', 'START');
        this.feathersBackend.isAuth().then(isAuth => {
            // No valid token to auto authenticate user ==> Authenticate user as anonymous by default
            if (isAuth == false) {
                this.logger.debug('[AuthService]', 'authUser()', 'Authenticate as Anonymous', 'PROGRESS', isAuth);
                this.authenticate({ strategy: "anonymous" })
                    .then((user: UserBackendApiModel) => {
                        this.logger.debug('[AuthService]', 'authUser()', 'Authenticate as Anonymous', 'END', 'OK', user);
                        this.initialAuthentication$.next(user);
                    })
                    .catch((error) => {
                        this.logger.debug('[AuthService]', 'authUser()', 'Authenticate as Anonymous', 'END', 'ERROR', error);
                    })
            } else {
                // try to authenticate with current valid token
                this.logger.debug('[AuthService]', 'authUser()', 'Try to re-auth current user', 'PROGRESS', isAuth);
                this.authenticate()
                    .then((user: UserBackendApiModel) => {
                        this.logger.debug('[AuthService]', 'authUser()', 'Try to re-auth current user', 'END', 'OK', user);
                        this.initialAuthentication$.next(user);
                    })
                    .catch((error) => {
                        this.logger.debug('[AuthService]', 'authUser()', 'Try to re-auth current user', 'END', 'ERROR', error);
                    })
            }
        })
    }
    /**
     * We should update USER state because of backend server events/state
     * @param state 
     */
    private updateUserState(state: BackendServiceConnectionState) {

        switch (state.changeReason) {
            // Something went wrong with sicketIO connection
            case stateChangeReason.socketIO_Connection_Error:
                this.logger.debug('[AuthService]', 'updateUserState()', 'EVENT', 'stateChangeReason.socketIO_Connection_Error');
                break;
            case stateChangeReason.socketIO_connection_timeout:
                this.logger.debug('[AuthService]', 'updateUserState()', 'EVENT', 'stateChangeReason.socketIO_connection_timeout');
                break;

            case stateChangeReason.Feathers_Logout:
                this.logger.debug('[AuthService]', 'updateUserState()', 'EVENT', 'stateChangeReason.Feathers_Logout');
                break;
            // If token has expired, try to reconnect as anonymous
            case stateChangeReason.Feathers_reauthentication_error:
                this.logger.debug('[AuthService]', 'updateUserState()', 'EVENT', 'stateChangeReason.Feathers_reauthentication_error');
                break;
            default:
                break;
        }
    }
}