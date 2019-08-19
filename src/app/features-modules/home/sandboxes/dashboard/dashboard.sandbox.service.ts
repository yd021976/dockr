import { Injectable, Inject } from '@angular/core';
import { Store } from '@ngxs/store';

import { AppLoggerServiceToken } from '../../../../shared/services/logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../../../shared/services/logger/app-logger/service/app-logger.service';
import { PermissionsService } from '../../../../shared/services/acl/permissions/permissions.service';
import { aclControllerFunc } from '../../../../shared/directives/permissions/permission.directive';
import { DashboardSandboxInterface } from './dashboard.sandbox.interface';

@Injectable()
export class DashboardSandbox extends DashboardSandboxInterface {
    

    constructor(
        store: Store,
        @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerService,
        protected permissionService: PermissionsService ) {

        super( store, loggerService, permissionService )
        this.loggerService.createLogger( this.loggerName )
    }

    /**
     * get ACL function that check acl
     */
    get aclController(): aclControllerFunc {
        return this.permissionService.checkACL
    }
}