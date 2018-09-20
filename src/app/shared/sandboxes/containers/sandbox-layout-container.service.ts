import { Injectable } from '@angular/core';

import { FeathersjsBackendService } from '../../services/backend/socketio/backend-feathers.service';
import { NotificationBaseService } from '../../services/notifications/notifications-base.service';
import { notificationType } from '../../models/notification-service.model';
import { SandboxBaseService } from '../sandbox-base.service';
import { stateChangeReason, BackendServiceConnectionState } from '../../models/backend-service-connection-state.model';

@Injectable()
export class SandboxLayoutContainerService extends SandboxBaseService {
    // Keep track of previous server connection state
    private currentIsConnected: boolean = false;

    constructor(private feathers: FeathersjsBackendService, notificationService: NotificationBaseService) {
        super(notificationService);
        this.ApiServiceConnectionState$ = this.feathers.connectionState$;

        // Subscribe to connection change state to auto authenticate user
        this.ApiServiceConnectionState$.subscribe(state => {
            // Update isAuth observable
            this.updateIsAuth(state);

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

    /**
     * (re) Authenticate user with existing stored token. If not, auth as anonymous
     */
    private authUser() {
        this.feathers.isAuth().then(isAuth => {
            // No valid token to auto authenticate user ==> Authenticate user as anonymous by default
            if (isAuth == false) {
                // this.feathers.authenticate({ strategy: 'local',email:'yann3',password:'yann' });
                this.feathers.authenticate({ strategy: "anonymous" });
            } else {
                // try to authenticate with current valid token
                this.feathers.authenticate();
            }
        })
    }

    /**
     * Update isAuthenticated sandbox state depending on backend connection state changes
     * @param state 
     */
    private updateIsAuth(state: BackendServiceConnectionState) {
        var isAuth: boolean = false;
        switch (state.changeReason) {
            case stateChangeReason.Feathers_Authenticated:
                if (state['user'] && state['user']['anonymous'])
                    isAuth = false;
                else
                    isAuth = true;
                break;

            case stateChangeReason.Feathers_Logout:
                isAuth = false;
                break;

            case stateChangeReason.socketIO_Connection_Error:
            case stateChangeReason.socketIO_connection_timeout:
                isAuth = false;
                break;

            default:
                break;
        }
        this.isAuthenticated$.next(isAuth);
    }
}