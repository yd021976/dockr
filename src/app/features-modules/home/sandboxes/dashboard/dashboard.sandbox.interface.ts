import { PermissionServiceInterface } from "src/app/shared/services/acl/permissions/permissions.service";
import { BaseSandboxService } from "src/app/shared/sandboxes/base-sandbox.service";
import { aclControllerFunc } from "src/app/shared/directives/permissions/permission.directive";
import { ApplicationInjector } from "src/app/shared/application.injector.class";
import { PermissionServiceToken } from "src/app/shared/directives/permissions/permissions.tokens";


export abstract class DashboardSandboxInterface extends BaseSandboxService {
    protected readonly logger_name: string = "DashboardSandbox"
    protected permissionService: PermissionServiceInterface

    constructor() {
        super()
        this.permissionService = ApplicationInjector.injector.get( PermissionServiceToken )
    }
    /**
     * fake resolver
     */
    public resolve( route, state ) {
        return true
    }

    public abstract get aclController(): aclControllerFunc


}