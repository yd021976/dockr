import { BaseSandboxService } from '../../../../shared/sandboxes/base-sandbox.service';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AclTreeNode, FlatTreeNode } from '../../../../shared/models/treenode.model';
import { AclServiceModel } from '../../../../shared/models/acl.services.model';
import { RolesService } from 'src/app/shared/services/acl/roles/roles.service';
import { AppLoggerServiceInterface } from 'src/app/shared/services/logger/app-logger/service/app-logger.service';
import { UserModelBase } from 'src/app/shared/models/user.model';
import { AclRoleModel } from 'src/app/shared/models/acl.role.model';
import { UsersService } from 'src/app/shared/services/users.service';
import { ApplicationInjector } from 'src/app/shared/application.injector.class';

/**
 * 
 */
export abstract class AdminUsersSandboxInterface extends BaseSandboxService {
    protected readonly logger_name: string = 'AdminUsersSandbox'
    public users_service: UsersService
    protected roles_service: RolesService
    public users$: Observable<UserModelBase[]>
    public selected_user$: Observable<UserModelBase>
    public available_roles$: Observable<AclRoleModel[]>

    constructor() {
        super()
        this.users_service = ApplicationInjector.injector.get( UsersService )
        this.roles_service = ApplicationInjector.injector.get( RolesService )
    }

    /**
     * 
     *                  SELECTORS
     * 
     */



    /**
     * 
     *                  ACTIONS
     * 
     */
    public abstract select_user( user: UserModelBase ): void
    public abstract users_add_user( user: UserModelBase ): void
    public abstract users_remove_user( user: UserModelBase ): void
    public abstract users_update_user( user: UserModelBase ): void
}