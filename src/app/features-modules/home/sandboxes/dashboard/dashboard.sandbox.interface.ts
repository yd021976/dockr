import { Inject } from "@angular/core";
import { AppLoggerServiceInterface } from "src/app/shared/services/logger/app-logger/service/app-logger.service";
import { AppLoggerServiceToken } from "src/app/shared/services/logger/app-logger/app-logger-token";
import { PermissionsService } from "src/app/shared/services/acl/permissions/permissions.service";
import { Store } from "@ngxs/store";
import { BaseSandboxService } from "src/app/shared/sandboxes/base-sandbox.service";
import { aclControllerFunc } from "src/app/shared/directives/permissions/permission.directive";


export abstract class DashboardSandboxInterface extends BaseSandboxService {
    protected readonly loggerName: string = "DashboardSandbox"

    constructor(
        store: Store,
        @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerServiceInterface,
        protected permissionService: PermissionsService ) {
        super( store, loggerService )
    }

    public abstract get aclController(): aclControllerFunc


}