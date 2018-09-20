import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import { FeathersjsBackendService } from '../../services/backend/socketio/backend-feathers.service';
import { NotificationBaseService } from '../../services/notifications/notifications-base.service';
import { notificationType } from '../../models/notification-service.model';
import { SandboxBaseService } from '../sandbox-base.service';
import { stateChangeReason, BackendServiceConnectionState } from '../../models/backend-service-connection-state.model';
import { UserLoginAction, UserLoginSuccessAction, UserLoginErrorAction, UserLogoutSuccessAction } from '../../store/actions/user.actions';

@Injectable()
export class SandboxLayoutContainerService extends SandboxBaseService {
    // Keep track of previous server connection state
    private currentIsConnected: boolean = false;

    constructor(private feathers: FeathersjsBackendService, notificationService: NotificationBaseService, store: Store) {
        super(notificationService, store);
        this.ApiServiceConnectionState$ = this.feathers.connectionState$;

        // Subscribe to connection change state to auto authenticate user
        this.ApiServiceConnectionState$.subscribe(state => {
            /**
             *  As FeathersJS backend keep track of login/logout and re-auth, 
             * we must update the USER state when the connection state changes
             */
            this.updateUserState(state);

            // We should try to re-auth user after a restored socketIO connection
            if (state.isConnected && this.currentIsConnected == false) {
                this.authUser();
                this.currentIsConnected = state.isConnected;
            }
        })
    }

    // TODO: to be removed -> Only for test
    navigateLogin() {
        this.notificationService.addNotification(notificationType.info, 'Navigate:Login');
    }

    //TODO: implement logout navigation
    navigateLogout() { }

    /**
     * (re) Authenticate user with existing stored token. If not, auth as anonymous
     */
    private authUser() {
        this.store.dispatch(new UserLoginAction({ strategy: 'anonymous' }));

        this.feathers.isAuth().then(isAuth => {
            // No valid token to auto authenticate user ==> Authenticate user as anonymous by default
            if (isAuth == false) {
                this.feathers.authenticate({ strategy: "anonymous" })
                    /** NOTE: We don't need to dispatch success login action here because backend will notify that a user loggedin. @see updateUserState */
                    .catch(error => this.store.dispatch(new UserLoginErrorAction(error.message))) // But errors still must be catched !
            } else {
                // try to authenticate with current valid token
                this.feathers.authenticate()
                    /** NOTE: We don't need to dispatch success login action here because backend will notify that a user loggedin, @see updateUserState */
                    .catch(error => this.store.dispatch(new UserLoginErrorAction(error.message))) // But errors still must be catched !
            }
        })
    }

    /**
     * We should update USER state because of with backend server events/state
     * @param state 
     */
    private updateUserState(state: BackendServiceConnectionState) {

        switch (state.changeReason) {
            // User authenticated
            case stateChangeReason.Feathers_Authenticated:
                this.store.dispatch(new UserLoginSuccessAction(state.user));
                break;
            // Something went wrong with connection, or user has logged out
            case stateChangeReason.Feathers_Logout:
            case stateChangeReason.socketIO_Connection_Error:
            case stateChangeReason.socketIO_connection_timeout:
                this.store.dispatch(new UserLogoutSuccessAction());
                break;

            // At this time (20/09/2018), no more event involve USER state update
            default:
                break;
        }
    }
}