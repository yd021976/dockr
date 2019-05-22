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
import { Acl_Load_All_Success, Acl_Tree_Node_Select, Acl_Load_All_Error } from "../../store/actions/acl2/acl2.state.actions";
import { Acl_Role_Add_Service_Success, Acl_Roles_Add_Entity_Success, Acl_Role_Remove_Entity_Success } from "../../store/actions/acl2/acl2.role.entity.actions";
import { RoleModel, RoleEntity } from "src/app/shared/models/acl/roles.model";
import { Acl_Field_Update_Allowed_Success, Acl_Field_Update_Allowed, Acl_Field_Update_Allowed_Error } from "../../store/actions/acl2/acl2.field.entity.action";
import { Acl_Action_Update_Allowed_Success, Acl_Action_Update_Allowed } from "../../store/actions/acl2/acl2.action.entity.actions";
import { Acl_Services_Remove_Entity_Success } from "../../store/actions/acl2/acl2.service.entity.actions";
import { Application_Event_Error } from "../../store/actions/application.actions";



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
        this.acltreenodes$ = this.store.select( Acl2State.treenode_getData() ) // ACL Observable
        this.currentSelectedNode$ = this.store.select( Acl2State.treenodes_get_currentSelectedNode )
        this.availableServices$ = this.store.select( Acl2State.role_get_availableServices )
    }

    /**
     * Load ACL's data
     */
    init() {
        this.rolesService.find()
            .then( ( results ) => {
                this.store.dispatch( new Acl_Load_All_Success( results ) )
            } )
            .catch( ( e ) => {
                this.store.dispatch( new Application_Event_Error( e ) )
                this.store.dispatch( new Acl_Load_All_Error( e ) )
            } )

        this.backendServices.find()
            .then( ( results ) => {
                this.store.dispatch( new Services_Load_All_Success( results ) )
            } )
            .catch( ( e ) => {
                this.store.dispatch( new Application_Event_Error( e ) )
            } )
    }
    /********************************************************************************************************
     * 
     *                                      Store selectors
     * 
     ********************************************************************************************************/
    getTreeNodeChildren$( node ): Observable<AclTreeNode[]> {
        return this.store.select( Acl2State.treenode_getData( node ) )
    }
    getTreeNodeChildren( node ): AclTreeNode[] {
        return this.store.selectSnapshot( Acl2State.treenode_getData( node ) )
    }

    nodeHasChildren( node ) {
        var children = this.store.selectSnapshot( Acl2State.treenode_getData( node ) )
        if ( !children ) {
            return false
        }
        if ( children.length != 0 ) return true
        return false
    }
    nodeGetParent( node ) {
        var parent = this.store.selectSnapshot( Acl2State.treenodes_get_parentNode( node ) )
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
    public treenodes_update_select_node( node: FlatTreeNode ) {
        this.store.dispatch( new Acl_Tree_Node_Select( node ) )
    }
    /**
     * Update field allowed checkbox and update children/parents allowed state
     * 
     * @param node 
     */
    public field_update_allowed_property( node: AclTreeNode ) {
        /**
         * Dispatch action to update role/acl state, then call backend API to update data
         */
        this.store.dispatch( new Acl_Field_Update_Allowed( node.uid, node.checked ) ).toPromise()
            .then( result => {
                // Get role/ACL object
                const role_entity: RoleEntity = this.store.selectSnapshot( Acl2State.treenode_get_rootRoleEntity( node ) )
                const role_model: RoleModel = this.store.selectSnapshot( Acl2State.role_get_denormalizeEntity( role_entity ) )

                this.rolesService.update( role_model, true )
                    .then( ( result ) => {
                        this.store.dispatch( new Acl_Field_Update_Allowed_Success( node.uid, node.checked ) )
                    } )
                    .catch( ( error ) => {
                        this.store.dispatch( new Acl_Field_Update_Allowed_Error( error ) )
                        this.store.dispatch( new Application_Event_Error( error ) )
                    } )
            } )
    }
    public action_update_allowed_property( node: AclTreeNode ) {
        this.store.dispatch( new Acl_Action_Update_Allowed( node.uid, node.checked ) )
        //TODO: Call backend API to update ACL when "action" is modified
        this.store.dispatch( new Acl_Action_Update_Allowed_Success( node.uid, node.checked ) )
    }
    public services_remove_entity( node: FlatTreeNode ) {
        this.store.dispatch( new Acl_Services_Remove_Entity_Success( node.data[ 'uid' ] ) )
    }
    /**
     * Add a service to an existing role
     * 
     * @param roleUid 
     */
    public role_add_service( roleUid: string, backendServiceModel: BackendServiceModel ) {
        this.store.dispatch( new Acl_Role_Add_Service_Success( roleUid, backendServiceModel ) )
    }
    public roles_add_entity( roleName: string ) {
        const roleObject: RoleModel = {
            name: roleName,
            _id: roleName,
            services: []
        }
        this.store.dispatch( new Acl_Roles_Add_Entity_Success( roleObject ) )
    }
    public roles_remove_entity( roleUid: string ) {
        this.store.dispatch( new Acl_Role_Remove_Entity_Success( roleUid ) )
    }

}