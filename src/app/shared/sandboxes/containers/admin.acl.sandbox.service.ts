import { Inject } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngxs/store";
import { AclTreeNode } from "../../models/acl/treenode.model";
import { AppLoggerService } from "../../services/logger/app-logger/service/app-logger.service";
import { AppLoggerServiceToken } from "../../services/logger/app-logger/app-logger-token";
import { BackendServiceModel } from "../../models/acl/backend-services.model";
import { BaseSandboxService } from "../base-sandbox.service";
import { NotificationBaseService } from "../../services/notifications/notifications-base.service";
import { RolesService } from "../../services/acl/roles/roles.service";
import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";
import { BackendServicesService } from "../../services/acl/services/backend-services.service";
import { Services_Load_All_Success } from "../../store/actions/services.actions";
import { Acl2State } from "../../store/states/acl2/acl2.state";
import { Acl_Load_All_Success, Acl_Tree_Node_Select } from "../../store/actions/acl2/acl2.state.actions";
import { Acl_Role_Add_Service_Success, Acl_Roles_Add_Entity_Success, Acl_Role_Remove_Entity_Success } from "../../store/actions/acl2/acl2.role.entity.actions";
import { RoleModel } from "src/app/shared/models/acl/roles.model";
import { Acl_Field_Update_Allowed_Success, Acl_Field_Update_Allowed } from "../../store/actions/acl2/acl2.field.entity.action";
import { Acl_Action_Update_Allowed_Success } from "../../store/actions/acl2/acl2.action.entity.actions";
import { Acl_Services_Remove_Entity_Success } from "../../store/actions/acl2/acl2.service.entity.actions";


@Inject( { providedIn: 'root' } )
export class AdminAclSandboxService extends BaseSandboxService {
    public acltreenodes$: Observable<AclTreeNode[]>
    public currentSelectedNode$: Observable<FlatTreeNode>
    public availableServices$: Observable<BackendServiceModel[]>

    constructor(
        notificationService: NotificationBaseService,
        store: Store,
        @Inject( AppLoggerServiceToken ) public logger: AppLoggerService,
        private rolesService: RolesService,
        private backendServices: BackendServicesService ) {
        super( notificationService, store, logger );
        this.acltreenodes$ = this.store.select( Acl2State.getTreeNodesData() ) // ACL Observable
        this.currentSelectedNode$ = this.store.select( Acl2State.currentSelectedNode )
        this.availableServices$ = this.store.select( Acl2State.availableRoleServices )
    }

    /**
     * Load ACL's data
     */
    init() {
        this.rolesService.find().then( ( results ) => {
            this.store.dispatch( new Acl_Load_All_Success( results ) )
        } )

        this.backendServices.find().then( ( results ) => {
            this.store.dispatch( new Services_Load_All_Success( results ) )
        } )
    }
    /********************************************************************************************************
     * 
     *                                      Store selectors
     * 
     ********************************************************************************************************/
    getTreeNodeChildren$( node ): Observable<AclTreeNode[]> {
        return this.store.select( Acl2State.getTreeNodesData( node ) )
    }
    getTreeNodeChildren( node ): AclTreeNode[] {
        return this.store.selectSnapshot( Acl2State.getTreeNodesData( node ) )
    }

    nodeHasChildren( node ) {
        var children = this.store.selectSnapshot( Acl2State.getTreeNodesData( node ) )
        if ( !children ) {
            return false
        }
        if ( children.length != 0 ) return true
        return false
    }
    nodeGetParent( node ) {
        var parent = this.store.selectSnapshot( Acl2State.getParent( node ) )
        return parent
    }

    /********************************************************************************************************
     * 
     *                                          State actions
     * 
     ********************************************************************************************************/

    /**
     * 
     * @param node 
     */
    public tree_select_node( node: FlatTreeNode ) {
        this.store.dispatch( new Acl_Tree_Node_Select( node ) )
    }
    /**
     * Update field allowed checkbox
     * 
     * @param node 
     */
    field_update_allowed_property( node: AclTreeNode ) {
        this.store.dispatch( new Acl_Field_Update_Allowed( node.uid, node.checked ) ).toPromise().then( result =>
            this.store.dispatch( new Acl_Field_Update_Allowed_Success( node.uid, node.checked ) )
        )
    }
    action_update_allowed_property( node: AclTreeNode ) {
        this.store.dispatch( new Acl_Action_Update_Allowed_Success( node.uid, node.checked ) )
    }
    services_remove_entity( node: FlatTreeNode ) {
        this.store.dispatch( new Acl_Services_Remove_Entity_Success( node.data[ 'uid' ] ) )
    }
    /**
     * Add a service to an existing role
     * 
     * @param roleUid 
     */
    role_add_service( roleUid: string, backendServiceModel: BackendServiceModel ) {
        this.store.dispatch( new Acl_Role_Add_Service_Success( roleUid, backendServiceModel ) )
    }
    roles_add_entity( roleName: string ) {
        const roleObject: RoleModel = {
            name: roleName,
            id: roleName,
            services: []
        }
        this.store.dispatch( new Acl_Roles_Add_Entity_Success( roleObject ) )
    }
    roles_remove_entity( roleUid: string ) {
        this.store.dispatch( new Acl_Role_Remove_Entity_Success( roleUid ) )
    }

}