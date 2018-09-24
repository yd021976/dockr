import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';

import { ApplicationState } from '../../store/states/application.state';
import { FeathersjsBackendService } from '../../services/backend/socketio/backend-feathers.service';
import { NotificationBaseService } from '../../services/notifications/notifications-base.service';
import { notificationType } from '../../models/notification-service.model';
import { SandboxBaseService } from '../sandbox-base.service';
import { UserModel } from '../../models/user.model';

@Injectable()
export class SandboxLayoutContainerService extends SandboxBaseService {
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
    }

    // TODO: hard coded route => Find a better way to get route to login page
    navigateLogin() {
        this.router.navigate(['auth/login']);
    }

    //TODO: hard coded route => Find a better way to get route to login page
    navigateLogout() {
        this.router.navigate(['auth/logout']);
    }
}