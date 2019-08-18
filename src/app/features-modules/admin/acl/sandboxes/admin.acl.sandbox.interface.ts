import { BaseSandboxService } from '../../../../shared/sandboxes/base-sandbox.service';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AclTreeNode, FlatTreeNode } from '../../../../shared/models/treenode.model';
import { AclServiceModel } from '../../../../shared/models/acl.services.model';
import { RolesService } from 'src/app/shared/services/acl/roles/roles.service';
import { BackendServicesService } from 'src/app/shared/services/acl/services/backend-services.service';
import { ResourcesLocksService } from 'src/app/shared/services/resource_locks/resources.locks.service';
import { AppLoggerServiceInterface } from 'src/app/shared/services/logger/app-logger/service/app-logger.service';

/**
 * 
 */
export abstract class AdminAclSandboxInterface extends BaseSandboxService {
    protected readonly logger_name: string = 'AdminAclSandbox'
    public acltreenodes$: Observable<AclTreeNode[]>
    public currentSelectedNode$: Observable<FlatTreeNode>
    public availableServices$: Observable<AclServiceModel[]>
    public isAclLocked$: Observable<boolean>

    constructor(
        protected store: Store,
        protected loggerService: AppLoggerServiceInterface,
        protected rolesService: RolesService,
        protected backendServices: BackendServicesService,
        protected resourcesLocksService: ResourcesLocksService ) {
        super( store, loggerService )
    }

    /**
     *               Startup / Init
     */
    public abstract init(): void


    /**
     * 
     *                  SELECTORS
     * 
     */
    public abstract getTreeNodeChildren$( node ): Observable<AclTreeNode[]>
    public abstract getTreeNodeChildren( node ): AclTreeNode[]
    public abstract nodeHasChildren( node ): boolean
    public abstract nodeGetParent( node ): AclTreeNode


    /**
     * 
     *                  ACTIONS
     * 
     */
    public abstract lockResource(): Promise<any>
    public abstract releaseResource(): Promise<any>
    public abstract treenodes_update_select_node( selected_node: FlatTreeNode ): void
    public abstract field_update_allowed_property( field_node: AclTreeNode ): void
    public abstract action_update_allowed_property( action_node: AclTreeNode ): void
    public abstract services_remove_entity( service_node: AclTreeNode ): void
    public abstract role_add_service( role_node: AclTreeNode, backendServiceModel: AclServiceModel ): void
    public abstract roles_add_entity( role_name: string ): void
    public abstract roles_remove_entity( role: AclTreeNode ): void

}