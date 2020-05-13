import { BaseSandboxService } from '../../../../shared/sandboxes/base-sandbox.service';
import { RolesService } from 'src/app/shared/services/acl/roles/roles.service';
import { ApplicationInjector } from 'src/app/shared/application.injector.class';
import { Observable } from 'rxjs';
import { AdminPermissionsFlatNode, AdminPermissionsEntityTypes, AdminPermissionsServiceEntity } from '../store/models/admin.permissions.model';
import { MatTreeFlatDataSource } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ResourcesLocksService } from 'src/app/shared/services/resource_locks/resources.locks.service';
import { backendservicesServiceToken } from 'src/app/shared/services/acl/services/backen-services.service.token';
import { BackendServicesInterface } from 'src/app/shared/services/acl/services/backend-services.service.interface';
import { BackendServiceModel } from 'src/app/shared/models/acl.services.model';
/**
 * 
 */
export abstract class AdminPermissionsSandboxInterface extends BaseSandboxService {
    protected readonly logger_name: string = 'AdminPermissionslSandbox'

    /** Services */
    protected rolesService: RolesService
    protected backendServices: BackendServicesInterface
    protected resourcesLocksService: ResourcesLocksService

    public datasource: MatTreeFlatDataSource<AdminPermissionsEntityTypes, AdminPermissionsFlatNode>
    public treecontrol: FlatTreeControl<AdminPermissionsFlatNode>
    public hasChild: (_: number, node: any) => boolean

    /** Selectors/Observables */
    public selectedNode$: Observable<AdminPermissionsFlatNode> /** current treeview selected node */
    public treenodes$: Observable<AdminPermissionsEntityTypes[]> /** treeview nodes for datasource service */
    public available_services$: Observable<any> /** list of available services for a selected role */
    public isAclLocked$: Observable<boolean> /** are data lock for modifications ? */
    public isDirty$: Observable<boolean> /** wether state has dirty entities to save */



    constructor() {
        super()
        this.resourcesLocksService = ApplicationInjector.injector.get(ResourcesLocksService)
        this.rolesService = ApplicationInjector.injector.get(RolesService)
        this.backendServices = ApplicationInjector.injector.get(backendservicesServiceToken)
    }

    /**
     * 
     *                  SELECTORS
     * 
     */
    public abstract role_exists(role_name): boolean

    /**
     * 
     *                  ACTIONS
     * 
     */

    /** select a treeview node */
    public abstract selectNode(node: AdminPermissionsFlatNode)

    /** update "allowed" status */
    public abstract node_update_allowed(node, allowed_status)

    /** Lock/unlock state for updates */
    public abstract lock_ressource()
    public abstract unlock_ressource()

    /** cancel state updates */
    public abstract cancel_update(entity?: AdminPermissionsEntityTypes)

    /** save state changes */
    public abstract save_changes(): void

    /** Add role entity */
    public abstract add_role_entity(name: string)
    /** remove role entity */
    public abstract remove_role_entity(node: AdminPermissionsFlatNode)
    /** Add service entity */
    public abstract add_service_entity(service: BackendServiceModel)
    /** remove service entity */
    public abstract remove_service_entity(node: AdminPermissionsFlatNode)

}