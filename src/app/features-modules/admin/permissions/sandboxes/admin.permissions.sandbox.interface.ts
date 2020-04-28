import { BaseSandboxService } from '../../../../shared/sandboxes/base-sandbox.service';
import { RolesService } from 'src/app/shared/services/acl/roles/roles.service';
import { ApplicationInjector } from 'src/app/shared/application.injector.class';
import { Observable } from 'rxjs';
import { AdminPermissionsBaseModel, AdminPermissionsEntitiesTypes, AdminPermissionsFlatNode, AdminPermissionsEntityTypes } from '../store/models/admin.permissions.model';
import { MatTreeFlatDataSource } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ResourcesLocksService } from 'src/app/shared/services/resource_locks/resources.locks.service';
/**
 * 
 */
export abstract class AdminPermissionsSandboxInterface extends BaseSandboxService {
    protected readonly logger_name: string = 'AdminPermissionslSandbox'
    protected rolesService: RolesService

    public datasource: MatTreeFlatDataSource<AdminPermissionsEntityTypes, AdminPermissionsFlatNode>
    public treecontrol: FlatTreeControl<AdminPermissionsFlatNode>
    public hasChild: (_: number, node: any) => boolean
    public selectedNode$: Observable<AdminPermissionsFlatNode>
    public currentSelectedEntity$: Observable<AdminPermissionsEntitiesTypes>
    public treenodes$: Observable<AdminPermissionsEntityTypes[]>

    protected resourcesLocksService: ResourcesLocksService
    public isAclLocked$: Observable<boolean>

    constructor() {
        super()
        this.resourcesLocksService = ApplicationInjector.injector.get( ResourcesLocksService )
        this.rolesService = ApplicationInjector.injector.get(RolesService)
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
    public abstract selectNode(node: AdminPermissionsFlatNode)
    public abstract node_update_allowed(node, allowed_status)
    public abstract lock_ressource()
    public abstract unlock_ressource()

}