import { Injectable, Inject } from '@angular/core';
import { Store } from '@ngxs/store';

import { NotificationBaseService } from '../../services/notifications/notifications-base.service';
import { BaseSandboxService } from '../base-sandbox.service';
import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../services/logger/app-logger/service/app-logger.service';
import { PermissionsService } from '../../services/acl/permissions/permissions.service';
import { aclControllerFunc } from '../../directives/permissions/permission.directive';

@Injectable()
export class DashboardSandbox extends BaseSandboxService {
    private readonly loggerName: string = "DashboardSandbox";

    constructor(
        store: Store,
        @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerService,
        protected permissions: PermissionsService ) {

        super( store, loggerService )
        this.loggerService.createLogger( this.loggerName )
    }

    /**
     * get ACL function that check acl
     */
    get aclController(): aclControllerFunc {
        return this.permissions.checkACL
    }
}