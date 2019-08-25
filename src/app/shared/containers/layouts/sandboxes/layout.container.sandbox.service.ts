import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store, } from '@ngxs/store';

import { FeathersjsBackendService } from '../../../services/backend_API_Endpoints/socketio/backend-feathers.service';
import { AppLoggerService } from '../../../services/logger/app-logger/service/app-logger.service';
import { AppLoggerServiceToken } from '../../../services/logger/app-logger/app-logger-token';
import { LayoutContainerSandboxInterface } from './layout.container.sandbox.interface';

@Injectable()
export class LayoutContainerSandboxService extends LayoutContainerSandboxInterface {

    protected readonly loggerName: string = "LayoutContainerSandboxService"

    constructor(
        protected feathers: FeathersjsBackendService,
        @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerService,
        store: Store,
        protected router: Router
    ) {
        super( feathers, loggerService, store, router )
        this.loggerService.createLogger( this.loggerName )
    }

    // TODO: hard coded route => Find a better way to get route to login page
    navigateLogin() {
        this.router.navigate( [ 'auth/login' ] );
    }

    //TODO: hard coded route => Find a better way to get route to login page
    navigateLogout() {
        this.router.navigate( [ 'auth/logout' ] );
    }
}