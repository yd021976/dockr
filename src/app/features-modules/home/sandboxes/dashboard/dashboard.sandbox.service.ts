import { Injectable, Inject } from '@angular/core';
import { Store } from '@ngxs/store';

import { AppLoggerServiceToken } from '../../../../shared/services/logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../../../shared/services/logger/app-logger/service/app-logger.service';
import { PermissionsService } from '../../../../shared/services/acl/permissions/permissions.service';
import { aclControllerFunc } from '../../../../shared/directives/permissions/permission.directive';
import { DashboardSandboxInterface } from './dashboard.sandbox.interface';

@Injectable()
export class DashboardSandbox extends DashboardSandboxInterface {


    constructor() {

        super()
        this.loggerService.createLogger( this.logger_name )
    }

    /**
     * get ACL function that check acl
     */
    get aclController(): aclControllerFunc {
        return this.permissionService.checkACL
    }

    /** unused but must be implemented */
    protected on_login() { }
    protected on_logout() { }
    
}