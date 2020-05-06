import { BaseSandboxService } from '../../../../shared/sandboxes/base-sandbox.service';
import { Observable } from 'rxjs';
import { AclTreeNode, FlatTreeNode } from '../../../../shared/models/treenode.model';
import { BackendServiceModel } from '../../../../shared/models/acl.services.model';
import { RolesService } from 'src/app/shared/services/acl/roles/roles.service';
import { BackendServicesService } from 'src/app/shared/services/acl/services/backend-services.service';
import { ResourcesLocksService } from 'src/app/shared/services/resource_locks/resources.locks.service';
import { ApplicationInjector } from 'src/app/shared/application.injector.class';

/**
 * 
 */
export abstract class AdminAclSandboxInterface extends BaseSandboxService {
    protected readonly logger_name: string = 'AdminAclSandbox'
    public test: string = "admin sandbox"
    public acltreenodes$: Observable<AclTreeNode[]>
    public currentSelectedNode$: Observable<FlatTreeNode>
    public availableServices$: Observable<BackendServiceModel[]>
    public isAclLocked$: Observable<boolean>

    protected rolesService: RolesService
    protected backendServices: BackendServicesService
    protected resourcesLocksService: ResourcesLocksService

    constructor() {
        super()
        this.rolesService = ApplicationInjector.injector.get( RolesService )
        this.backendServices = ApplicationInjector.injector.get( BackendServicesService )
        this.resourcesLocksService = ApplicationInjector.injector.get( ResourcesLocksService )
    }

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
    public abstract role_add_service( role_node: AclTreeNode, backendServiceModel: BackendServiceModel ): void
    public abstract roles_add_entity( role_name: string ): void
    public abstract roles_remove_entity( role: AclTreeNode ): void

}