import { Injectable } from '@angular/core';
import { Store, Select } from '@ngxs/store';

import { ApplicationState } from '../../store/states/application.state';
import { FeathersjsBackendService } from '../../services/backend/socketio/backend-feathers.service';
import { NotificationBaseService } from '../../services/notifications/notifications-base.service';
import { notificationType } from '../../models/notification-service.model';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { SandboxBaseService } from '../sandbox-base.service';
import { stateChangeReason, BackendServiceConnectionState } from '../../models/backend-service-connection-state.model';
import { UserModel } from '../../models/user.model';
import { UserLoginAction, UserLoginSuccessAction, UserLoginErrorAction, UserLogoutSuccessAction, UserLogoutAction } from '../../store/actions/user.actions';

@Injectable()
export class SandboxLayoutContainerService extends SandboxBaseService {
    // Keep track of previous server connection state
    private currentIsConnected: boolean = false;

    @Select(ApplicationState.getUser) public currentUser$: Observable<UserModel>;

    constructor(
        private feathers: FeathersjsBackendService,
        notificationService: NotificationBaseService,
        logger: NGXLogger,
        store: Store,
        private router: Router
    ) {

        super(notificationService, store, logger);
        this.ApiServiceConnectionState$ = this.feathers.connectionState$;

        // Subscribe to connection change state to auto authenticate user
        this.ApiServiceConnectionState$.subscribe(state => {
            /**
             *  As FeathersJS backend keep track of login/logout and re-auth, 
             *  we must update the USER state when the connection state changes
             */
            this.updateUserState(state);

            // We should try to re-auth user after a restored socketIO connection or at first socketIO connection
            if (state.isConnected && this.currentIsConnected == false) {
                this.authUser();
                this.currentIsConnected = state.isConnected;
            }
        })
    }

    // TODO: to be removed -> Only for test
    navigateLogin() {
        this.router.navigate(['login']);
    }

    //TODO: implement logout navigation
    navigateLogout() { }

    /**
     * (re) Authenticate user with existing stored token. If not, auth as anonymous
     */
    private authUser() {
        this.logger.debug('[SandboxLayoutContainerService]', 'authUser()', 'START');
        this.store.dispatch(new UserLoginAction());

        this.feathers.isAuth().then(isAuth => {
            // No valid token to auto authenticate user ==> Authenticate user as anonymous by default
            if (isAuth == false) {
                this.logger.debug('[SandboxLayoutContainerService]', 'authUser()', 'Auth as Anonymous', 'START');
                this.feathers.authenticate({ strategy: "anonymous" })
                    .then((user) => {
                        this.logger.debug('[SandboxLayoutContainerService]', 'authUser()', 'Auth as Anonymous', 'END', 'OK', user);
                        this.store.dispatch(new UserLoginSuccessAction(user))
                    })
                    .catch((error) => {
                        this.logger.debug('[SandboxLayoutContainerService]', 'authUser()', 'Auth as Anonymous', 'END', 'ERROR', error);
                        this.store.dispatch(new UserLoginErrorAction(error.message))
                    })
            } else {
                // try to authenticate with current valid token
                this.logger.debug('[SandboxLayoutContainerService]', 'authUser()', 'Try to re-auth current user', 'START');
                this.feathers.authenticate()
                    .then((user) => {
                        this.logger.debug('[SandboxLayoutContainerService]', 'authUser()', 'Try to re-auth current user', 'END', 'OK', user);
                        this.store.dispatch(new UserLoginSuccessAction(user))
                    })
                    .catch((error) => {
                        this.logger.debug('[SandboxLayoutContainerService]', 'authUser()', 'Try to re-auth current user', 'END', 'ERROR', error);
                        this.store.dispatch(new UserLoginErrorAction(error.message))
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
            // Something went wrong with connection
            case stateChangeReason.socketIO_Connection_Error:
            case stateChangeReason.socketIO_connection_timeout:
                this.store.dispatch(new UserLogoutSuccessAction());
                break;

            // If token has expired, try to reconnect as anonymous
            case stateChangeReason.Feathers_reauthentication_error:
                // console.log('[LayoutSandbox] feathers reauth-error => Log as anonymous START');
                // const currentUser = this.ApiServiceConnectionState$.getValue();

                // // If user was not anonymous, notify session has expired
                // if (!currentUser['anonymous']) {
                //     this.notificationService.addNotification(notificationType.alert, 'Session has expired. You are now disconnected');
                // }

                // // Then we log in as anonymous to ensure we have a user connected
                // this.store.dispatch(new UserLoginAction());
                // this.feathers.authenticate({ strategy: 'anonymous' })
                //     .then((user) => {
                //         this.store.dispatch(new UserLoginSuccessAction(user))
                //         console.log('[LayoutSandbox] feathers reauth-error => Log as anonymous END (ok)');
                //     })
                //     .catch((error) => {
                //         this.store.dispatch(new UserLoginErrorAction(error.message))
                //         console.log('[LayoutSandbox] feathers reauth-error => Log as anonymous END (error)');
                //     })
                break;
            // At this time (20/09/2018), no more event involve USER state update
            default:
                break;
        }
    }
}