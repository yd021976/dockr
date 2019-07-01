import { Inject } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngxs/store";
import { AclTreeNode, NODE_TYPES } from "../../models/acl/treenode.model";
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
import { Acl_Load_All_Success, Acl_Tree_Node_Select, Acl_Load_All_Error, Acl_Lock_Resource_Success, Acl_Lock_Resource_Error, Acl_UnLock_Resource, Acl_UnLock_Resource_Success, Acl_UnLock_Resource_Error, Acl_Lock_Resource } from "../../store/actions/acl2/acl2.state.actions";
import { Acl_Role_Add_Service_Success, Acl_Roles_Add_Entity_Success, Acl_Role_Remove_Entity_Success, Acl_Roles_Add_Entity, Acl_Roles_Add_Entity_Error, Acl_Roles_Remove_Entity, Acl_Roles_Remove_Entity_Error, Acl_Role_Add_Service } from "../../store/actions/acl2/acl2.role.entity.actions";
import { RoleModel, RoleEntity } from "src/app/shared/models/acl/roles.model";
import { Acl_Field_Update_Allowed_Success, Acl_Field_Update_Allowed, Acl_Field_Update_Allowed_Error } from "../../store/actions/acl2/acl2.field.entity.action";
import { Acl_Action_Update_Allowed_Success, Acl_Action_Update_Allowed, Acl_Action_Update_Allowed_Error } from "../../store/actions/acl2/acl2.action.entity.actions";
import { Acl_Services_Remove_Entity_Success, Acl_Services_Remove_Entity, Acl_Services_Remove_Entity_Error } from "../../store/actions/acl2/acl2.service.entity.actions";
import { Application_Event_Notification } from "../../store/actions/application.actions";
import { ResourcesLocksService } from "../../services/resource_locks/resources.locks.service";
import { ApplicationNotification, ApplicationNotificationType } from "../../models/acl2/application.notifications.model";
import { ApplicationNotifications_Append_Message } from "../../store/actions/application-notifications.actions";
import { Acl_Role_Add_Service_Error } from "../../store/actions/acl/acl.actions";
import { v4 as uuid } from 'uuid';


@Inject( { providedIn: 'root' } )
export class AdminAclSandboxService extends BaseSandboxService {
    public acltreenodes$: Observable<AclTreeNode[]>
    public currentSelectedNode$: Observable<FlatTreeNode>
    public availableServices$: Observable<BackendServiceModel[]>
    public isAclLocked$: Observable<boolean>

    constructor(
        notificationService: NotificationBaseService,
        store: Store,
        @Inject( AppLoggerServiceToken ) public logger: AppLoggerService,
        private rolesService: RolesService,
        private backendServices: BackendServicesService,
        private resourcesLocksService: ResourcesLocksService ) {

        super( notificationService, store, logger );
        this.acltreenodes$ = this.store.select( Acl2State.treenode_getData() ) // ACL Observable
        this.currentSelectedNode$ = this.store.select( Acl2State.treenodes_get_currentSelectedNode )
        this.availableServices$ = this.store.select( Acl2State.role_get_availableServices )
        this.isAclLocked$ = this.store.select( Acl2State.lock_get_state )

    }

    /**
     * Load ACL's data
     */
    init() {
        this.rolesService.find()
            .then( ( results ) => {
                this.store.dispatch( new Acl_Load_All_Success( results ) )
            } )
            .catch( ( err ) => {
                this.store.dispatch( new Application_Event_Notification( new ApplicationNotification( err.message, err[ 'name' ], ApplicationNotificationType.ERROR ) ) )
                this.store.dispatch( new Acl_Load_All_Error( err ) )
            } )

        this.backendServices.find()
            .then( ( results ) => {
                this.store.dispatch( new Services_Load_All_Success( results ) )
            } )
            .catch( ( err ) => {
                this.store.dispatch( new Application_Event_Notification( new ApplicationNotification( err.message, 'LoadRolesError', ApplicationNotificationType.ERROR ) ) )
            } )

        /**
         * look for ACL lock for user
         */
        this.store.dispatch( new Acl_UnLock_Resource_Success() ) // By default, no lock is acquired
        this.resourcesLocksService.list( false )
            .then( locked_resources => {
                // Search for existing "acl" lock
                Object.keys( locked_resources ).forEach( ( resource_id ) => {
                    if ( resource_id == 'acl' ) {
                        // check resource is locked
                        if ( locked_resources[ resource_id ].lockInfos.state == 'locked' )
                            // The resource "acl" if already lock, update state
                            this.store.dispatch( new Acl_Lock_Resource_Success() )
                    }
                } )
            } )
            .catch( err => {
                this.store.dispatch( new Acl_Lock_Resource_Error( err ) )
            } )
    }

    /**
     * Lock ACL resource for updates
     */
    lockResource(): Promise<any> {
        let lock_result: any = null
        const resource_name: string = "acl"

        this.store.dispatch( new Acl_Lock_Resource() )

        return this.resourcesLocksService.lock( resource_name )
            .then( locked => {
                this.store.dispatch( new Acl_Lock_Resource_Success() )
                this.store.dispatch( new ApplicationNotifications_Append_Message( new ApplicationNotification( 'Data are locked. You can modify them.', 'AclLocked', ApplicationNotificationType.INFO ) ) )
                return locked
            } )
            .catch( err => {
                if ( err.name != 'lockAlreadyAcquired' ) {
                    this.store.dispatch( new Acl_Lock_Resource_Error( err ) )
                    this.store.dispatch( new Application_Event_Notification( new ApplicationNotification( err.message, 'AclLockError', ApplicationNotificationType.ERROR ) ) )
                }
                else {
                    this.store.dispatch( new Acl_Lock_Resource_Success() )
                    return err.data[ 'lockInfos' ] || null
                }
            } )

    }

    /**
     * Release ACL resource
     */
    releaseResource(): Promise<any> {
        const resource_name: string = "acl"
        this.store.dispatch( new Acl_UnLock_Resource() )

        return this.resourcesLocksService.release( resource_name )
            .then( released => {
                this.store.dispatch( new Acl_UnLock_Resource_Success() )
                this.store.dispatch( new ApplicationNotifications_Append_Message( new ApplicationNotification( 'Data are unlocked. You can\'t modify them.', 'AclRelease', ApplicationNotificationType.INFO ) ) )
                return released
            } )
            .catch( ( err ) => {
                this.store.dispatch( new Acl_UnLock_Resource_Error( err ) )
                this.store.dispatch( new Application_Event_Notification( new ApplicationNotification( err.message, 'AclReleaseError', ApplicationNotificationType.ERROR ) ) )
            } )

    }

    /**
     * Get parent role from an ACL treenode
     * 
     * @param node 
     */
    private node_get_parentRole( node: AclTreeNode ): RoleModel {
        const role_entity: RoleEntity = this.store.selectSnapshot( Acl2State.treenode_get_rootRoleEntity( node ) )
        const role_model: RoleModel = this.store.selectSnapshot( Acl2State.role_get_denormalizeEntity( role_entity ) )
        if ( !role_model ) throw new Error( '[AdminAclSandboxService] No parent role found for node' )
        return role_model
    }

    /**
     * Update a role in backend
     * 
     * @param role_model 
     */
    private backendApi_store_role( role_model: RoleModel ): Promise<any> {
        return this.rolesService.update( role_model, true )
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
     * State action
     * 
     * Set the current state selected node
     * 
     * @param selected_node 
     */
    public treenodes_update_select_node( selected_node: FlatTreeNode ) {
        this.store.dispatch( new Acl_Tree_Node_Select( selected_node ) )
    }


    /**
     * State action
     * 
     * Update field allowed checkbox and update children/parents allowed state
     * 
     * @param field_node 
     */
    public field_update_allowed_property( field_node: AclTreeNode ) {
        /**
         * Dispatch action to update role/acl state, then call backend API to update data
         */
        this.store.dispatch( new Acl_Field_Update_Allowed( field_node.uid, field_node.checked ) ).toPromise()
            .then( result => {
                /**
                 * Store role acl and update store
                 */
                this.backendApi_store_role( this.node_get_parentRole( field_node ) )
                    .then( ( result ) => {
                        this.store.dispatch( new Acl_Field_Update_Allowed_Success( field_node.uid, field_node.checked ) )
                    } )
                    .catch( ( error ) => {
                        this.store.dispatch( new Acl_Field_Update_Allowed_Error( error ) )
                        this.store.dispatch( new Application_Event_Notification( new ApplicationNotification( error.message, 'Backend_AclFieldUpdate', ApplicationNotificationType.ERROR ) ) )
                    } )
            } )
    }

    /**
     * State action
     * 
     * Update an "action" check state
     * 
     * @param action_node 
     */
    public action_update_allowed_property( action_node: AclTreeNode ) {
        // Update store
        this.store.dispatch( new Acl_Action_Update_Allowed( action_node.uid, action_node.checked ) ).toPromise()
            .then( result => {
                this.backendApi_store_role( this.node_get_parentRole( action_node ) )
                    .then( ( result ) => {
                        this.store.dispatch( new Acl_Action_Update_Allowed_Success( action_node.uid, action_node.checked ) )
                    } )
                    .catch( err => {
                        this.store.dispatch( new Acl_Action_Update_Allowed_Error( err ) )
                        this.store.dispatch( new Application_Event_Notification( new ApplicationNotification( err.message, 'Backend_AclActionUpdate', ApplicationNotificationType.ERROR ) ) )
                    } )
            } )
            .catch( err => {
                //TODO: Handle error if store update error for action node
            } )

    }
    /**
     * State action
     * 
     * Remove a service from role
     * 
     * @param service_node 
     */
    public services_remove_entity( service_node: AclTreeNode ) {
        this.store.dispatch( new Acl_Services_Remove_Entity( service_node.uid ) ).toPromise()
            .then( () => {
                this.backendApi_store_role( this.node_get_parentRole( service_node ) )
                    .then( () => {
                        this.store.dispatch( new Acl_Services_Remove_Entity_Success( service_node.uid ) )
                    } )
                    .catch( err => {
                        this.store.dispatch( new Application_Event_Notification( new ApplicationNotification( err.message, 'Backend_AclServiceRemove', ApplicationNotificationType.ERROR ) ) )
                        this.store.dispatch( new Acl_Services_Remove_Entity_Error( err ) )
                    } )
            } )
            .catch( err => {
                // TODO: Handle error when ACL state error
            } )

        this.store.dispatch( new Acl_Services_Remove_Entity_Success( service_node.uid ) )
    }


    /**
     * State action
     * 
     * Add a service to an existing role
     * 
     * @param role_node 
     */
    public role_add_service( role_node: AclTreeNode, backendServiceModel: BackendServiceModel ) {
        // Add service entity to role
        this.store.dispatch( new Acl_Role_Add_Service( role_node.uid, backendServiceModel ) ).toPromise()
            // Store in updated role in backend
            .then( () => {
                const role_entity = this.store.selectSnapshot( Acl2State.entity_get_fromUid( role_node.uid, NODE_TYPES.ROLE ) )
                const role_model: RoleModel = this.store.selectSnapshot( Acl2State.role_get_denormalizeEntity( role_entity as RoleEntity ) )
                this.backendApi_store_role( role_model )
                    .then( ( result ) => {
                        this.store.dispatch( new Acl_Role_Add_Service_Success( role_node.uid, backendServiceModel ) )
                    } )
                    .catch( err => {
                        this.store.dispatch( new Acl_Role_Add_Service_Error( err ) )
                        this.store.dispatch( new Application_Event_Notification( new ApplicationNotification( err.message, 'Backend_AclRoleAddService', ApplicationNotificationType.ERROR ) ) )
                    } )
            } )
            .catch( err => {

            } )

    }

    /**
     * State action
     * 
     * Add a new role
     * 
     * @param role_name 
     */
    public roles_add_entity( role_name: string ) {
        const roleObject: RoleModel = {
            uid: uuid(), //IMPORTANT: We set here the UUID of the node because we need to know it later to get role entity and role model
            name: role_name,
            _id: role_name,
            services: [] // As it is a new role, we are sure that there is no attached services
        }
        this.store.dispatch( new Acl_Roles_Add_Entity( roleObject ) ).toPromise()
            .then( result => {
                const role_entity = this.store.selectSnapshot( Acl2State.entity_get_fromUid( roleObject.uid, NODE_TYPES.ROLE ) )
                const role_model: RoleModel = this.store.selectSnapshot( Acl2State.role_get_denormalizeEntity( role_entity as RoleEntity ) )
                this.backendApi_store_role( role_model )
                    .then( result => {
                        this.store.dispatch( new Acl_Roles_Add_Entity_Success( roleObject ) )
                    } )
                    .catch( err => {
                        this.store.dispatch( new Acl_Roles_Add_Entity_Error( err ) )
                        this.store.dispatch( new Application_Event_Notification( new ApplicationNotification( err.message, 'Backend_AclAddRole', ApplicationNotificationType.ERROR ) ) )
                    } )
            } )
            .catch( err => { } )
    }

    /**
     * State action
     * 
     * Remove a role
     * 
     * @param role_uid 
     */
    public roles_remove_entity( role_uid: string ) {
        this.store.dispatch( new Acl_Roles_Remove_Entity( role_uid ) ).toPromise()
            .then( result => {
                const role_entity = this.store.selectSnapshot( Acl2State.entity_get_fromUid( role_uid, NODE_TYPES.ROLE ) )
                const role_model: RoleModel = this.store.selectSnapshot( Acl2State.role_get_denormalizeEntity( role_entity as RoleEntity ) )
                this.backendApi_store_role( role_model )
                    .then( result => {
                        this.store.dispatch( new Acl_Role_Remove_Entity_Success( role_uid ) )
                    } )
                    .catch( err => {
                        this.store.dispatch( new Application_Event_Notification( new ApplicationNotification( err.message, 'Backend_AclRemoveRole', ApplicationNotificationType.ERROR ) ) )
                        this.store.dispatch( new Acl_Roles_Remove_Entity_Error( err ) )
                    } )
            } )
            .catch( err => { } )

    }

}