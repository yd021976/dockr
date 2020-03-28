import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AclTreeNode, NODE_TYPES, FlatTreeNode } from "../../../../shared/models/treenode.model";
import { AclServiceModel } from "../../../../shared/models/acl.services.model";
import { Services_Load_All_Success, Services_Load_All } from "../../../../shared/store/actions/services.actions";
import { AclUIActions } from '../../../../shared/store/actions/acl2/acl2.state.actions'
import { RolesStateActions } from "../../../../shared/store/actions/acl2/acl2.role.entity.actions"
import { AclRoleModel, AclRoleEntity } from "src/app/shared/models/acl.role.model";
import { Acl_Field_Update_Allowed_Success, Acl_Field_Update_Allowed, Acl_Field_Update_Allowed_Error } from "../../../../shared/store/actions/acl2/acl2.field.entity.action";
import { Acl_Action_Update_Allowed_Success, Acl_Action_Update_Allowed, Acl_Action_Update_Allowed_Error } from "../../../../shared/store/actions/acl2/acl2.action.entity.actions";
import { Acl_Services_Remove_Entity_Success, Acl_Services_Remove_Entity, Acl_Services_Remove_Entity_Error } from "../../../../shared/store/actions/acl2/acl2.service.entity.actions";
import { Application_Event_Notification } from "../../../../shared/store/actions/application.actions";
import { ApplicationNotification, ApplicationNotificationType } from "../../../../shared/models/application.notifications.model";
import { ApplicationNotifications_Append_Message } from "../../../../shared/store/actions/application-notifications.actions";
import { v4 as uuid } from 'uuid';
import { map } from "rxjs/operators";
import { UserModel } from "../../../../shared/models/user.model";
import { AclEntitiesSelectors } from "../../../../shared/store/states/acl/selectors/acl.entities.selectors";
import { ApplicationLocksActions } from "../../../../shared/store/actions/application.locks.actions";
import { ApplicationLocksSelectors } from "../../../../shared/store/states/locks/application.locks.selectors";
import { AclTreeSelectors } from '../../../../shared/store/states/acl/selectors/acl.tree.selectors'
import { AclUISelectors } from "../../../../shared/store/states/acl/selectors/acl.ui.selectors";
import { RolesSelectors } from "../../../../shared/store/states/acl/selectors/roles.selectors";
import { AdminAclSandboxInterface } from "./admin.acl.sandbox.interface";

@Injectable( { providedIn: 'root' } )
export class AdminAclSandboxService extends AdminAclSandboxInterface {
    public acltreenodes$: Observable<AclTreeNode[]>
    public currentSelectedNode$: Observable<FlatTreeNode>
    public availableServices$: Observable<AclServiceModel[]>
    public isAclLocked$: Observable<boolean>

    constructor() {

        super()
        this.debug( { message: 'constructor called', otherParams: [] } )

        this.acltreenodes$ = this.store.select( AclTreeSelectors.treenode_getData() ) // ACL Observable
        this.currentSelectedNode$ = this.store.select( AclUISelectors.treenodes_get_currentSelectedNode )
        this.availableServices$ = this.store.select( RolesSelectors.role_get_availableServices )
        this.isAclLocked$ = this.store.select( ApplicationLocksSelectors.isLocked( 'acl' ) )

        // When ACL (roles) change, update permission service
        let roles$ = this.store.select( RolesSelectors.roles_get_list )
        roles$
            .pipe(
                map( roles => {
                    return roles.filter( ( role => {
                        let user: UserModel = this.store.selectSnapshot( state => {
                            return state.application.user
                        } )
                        if ( user ) {
                            const hasRole: boolean = user.roles.findIndex( ( user_role ) => role._id == user_role ) == -1 ? false : true
                            return hasRole
                        }
                        return false
                    } ) )
                } )
            )
            .subscribe( roles => {
                let a = 0
            } )
    }

    /**
     * Route Resolver : Load backend data
     * 
     * @param route 
     * @param state 
     */
    resolve( route, state ): Promise<any> {
        let promises: Promise<any>[] = []
        promises.push( this.initRoles(), this.initServices(), this.initLock() )
        return Promise.all( promises )
    }

    /**
     * Load roles
     */
    private initRoles(): Promise<any> {
        this.store.dispatch( new RolesStateActions.Load_All() )
        return this.rolesService.find()
            .then( ( results ) => {
                this.store.dispatch( new RolesStateActions.Load_All_Success( results ) )
            } )
            .catch( ( err ) => {
                this.store.dispatch( new Application_Event_Notification( new ApplicationNotification( err.message, err[ 'name' ], ApplicationNotificationType.ERROR ) ) )
                this.store.dispatch( new RolesStateActions.Load_All_Error( err ) )
            } )
    }
    /**
     * Load backend available services
     */
    private initServices(): Promise<any> {
        this.store.dispatch( new Services_Load_All() )
        return this.backendServices.find()
            .then( ( results ) => {
                this.store.dispatch( new Services_Load_All_Success( results ) )
            } )
            .catch( ( err ) => {
                this.store.dispatch( new Application_Event_Notification( new ApplicationNotification( err.message, 'LoadRolesError', ApplicationNotificationType.ERROR ) ) )
            } )
    }

    /**
     * Init ACL/Roles data lock state
     */
    private initLock(): Promise<any> {
        this.store.dispatch( [ new ApplicationLocksActions.remove( { name: 'acl' } ), new AclUIActions.Resource_Lock() ] )
        return this.resourcesLocksService.list( false )
            .then( locked_resources => {
                // Search for existing "acl" lock
                Object.keys( locked_resources ).forEach( ( resource_id ) => {
                    if ( resource_id == 'acl' ) {
                        // check resource is locked
                        if ( locked_resources[ resource_id ].lockInfos.state == 'locked' )
                            // The resource "acl" is already lock, update state
                            this.store.dispatch( new ApplicationLocksActions.add( { name: 'acl', isLocked: true } ) )
                    }
                } )
                return // progress to next "then" step
            } )
            .then( () => {
                this.store.dispatch( new AclUIActions.Resource_Lock_Success() )
            } )
            .catch( err => {
                this.store.dispatch( new AclUIActions.Resource_Lock_Error( err ) )
            } )
    }

    /**
     * Lock ACL resource for updates
     */
    lockResource(): Promise<any> {
        let lock_result: any = null
        const resource_name: string = "acl"

        this.store.dispatch( new AclUIActions.Resource_Lock() )

        return this.resourcesLocksService.lock( resource_name )
            .then( locked => {
                this.store.dispatch( [
                    new AclUIActions.Resource_Lock_Success(),
                    new ApplicationLocksActions.update( resource_name, { name: resource_name, isLocked: true } ),
                    new ApplicationNotifications_Append_Message( new ApplicationNotification( 'Data are locked. You can modify them.', 'AclLocked', ApplicationNotificationType.INFO ) )
                ] )
                return locked
            } )
            .catch( err => {
                if ( err.name != 'lockAlreadyAcquired' ) {
                    this.store.dispatch( new AclUIActions.Resource_Lock_Error( err ) )
                    this.store.dispatch( new Application_Event_Notification( new ApplicationNotification( err.message, 'AclLockError', ApplicationNotificationType.ERROR ) ) )
                }
                else {
                    this.store.dispatch( [ new AclUIActions.Resource_Lock_Success(), new ApplicationLocksActions.update( resource_name, { name: resource_name, isLocked: false } ) ] )
                    return err.data[ 'lockInfos' ] || null
                }
            } )

    }

    /**
     * Release ACL resource
     */
    releaseResource(): Promise<any> {
        const resource_name: string = "acl"
        this.store.dispatch( new AclUIActions.Resource_UnLock() )

        return this.resourcesLocksService.release( resource_name )
            .then( released => {
                this.store.dispatch( [
                    new AclUIActions.Resource_UnLock_Success(),
                    new ApplicationNotifications_Append_Message( new ApplicationNotification( 'Data are unlocked. You can\'t modify them.', 'AclRelease', ApplicationNotificationType.INFO ) ),
                    new ApplicationLocksActions.update( resource_name, { name: resource_name, isLocked: false } )
                ] )
                return released
            } )
            .catch( ( err ) => {
                this.store.dispatch( [
                    new AclUIActions.Resource_UnLock_Error( err ),
                    new ApplicationLocksActions.update( resource_name, { name: resource_name, isLocked: false } ),
                    new Application_Event_Notification( new ApplicationNotification( err.message, 'AclReleaseError', ApplicationNotificationType.ERROR ) )
                ] )
            } )

    }

    /**
     * Get parent role from an ACL treenode
     * 
     * @param node 
     */
    private node_get_parentRole( node: AclTreeNode ): AclRoleModel {
        const role_entity: AclRoleEntity = this.store.selectSnapshot( AclTreeSelectors.treenode_get_rootRoleEntity( node ) )
        const role_model: AclRoleModel = this.store.selectSnapshot( RolesSelectors.role_get_denormalizeEntity( role_entity ) )
        if ( !role_model ) throw new Error( '[AdminAclSandboxService] No parent role found for node' )
        return role_model
    }

    /**
     * Update a role in backend
     * 
     * @param role_model 
     */
    private backendApi_store_role( role_model: AclRoleModel ): Promise<any> {
        return this.rolesService.update( role_model, true )
    }
    /********************************************************************************************************
     * 
     *                                      Store selectors
     * 
     ********************************************************************************************************/
    getTreeNodeChildren$( node ): Observable<AclTreeNode[]> {
        return this.store.select( AclTreeSelectors.treenode_getData( node ) )
    }
    getTreeNodeChildren( node ): AclTreeNode[] {
        return this.store.selectSnapshot( AclTreeSelectors.treenode_getData( node ) )
    }

    nodeHasChildren( node ): boolean {
        var children = this.store.selectSnapshot( AclTreeSelectors.treenode_getData( node ) )
        if ( !children ) {
            return false
        }
        if ( children.length != 0 ) return true
        return false
    }
    nodeGetParent( node ): AclTreeNode {
        var parent = this.store.selectSnapshot( AclTreeSelectors.treenodes_get_parentNode( node ) )
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
        this.store.dispatch( new AclUIActions.Acl_Tree_Node_Select( selected_node ) )
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
                        this.store.dispatch( [
                            new Acl_Field_Update_Allowed_Error( error ),
                            new Application_Event_Notification( new ApplicationNotification( error.message, 'Backend_AclFieldUpdate', ApplicationNotificationType.ERROR ) )
                        ] )
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
                        this.store.dispatch( [
                            new Acl_Action_Update_Allowed_Error( err ),
                            new ApplicationNotification( err.message, 'Backend_AclActionUpdate', ApplicationNotificationType.ERROR )
                        ] )
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
        // Get role object before removing service : We need the UID of the role node
        const role_node: AclRoleModel = this.node_get_parentRole( service_node )

        // Remove service from state, then update backend
        this.store.dispatch( new Acl_Services_Remove_Entity( service_node.uid ) ).toPromise()
            .then( () => {
                // get updated role
                const role_entity = this.store.selectSnapshot( AclEntitiesSelectors.entity_get_fromUid( role_node.uid, NODE_TYPES.ROLE ) )
                const role_model = this.store.selectSnapshot( RolesSelectors.role_get_denormalizeEntity( role_entity as AclRoleEntity ) )
                this.backendApi_store_role( role_model )
                    .then( ( result ) => {
                        this.store.dispatch( new Acl_Services_Remove_Entity_Success( service_node.uid ) )
                    } )
                    .catch( err => {
                        this.store.dispatch( [
                            new Application_Event_Notification( new ApplicationNotification( err.message, 'Backend_AclServiceRemove', ApplicationNotificationType.ERROR ) ),
                            new Acl_Services_Remove_Entity_Error( err )
                        ] )
                    } )
            } )
            .catch( err => {
                // TODO: Handle error when ACL state error
            } )
    }


    /**
     * State action
     * 
     * Add a service to an existing role
     * 
     * @param role_node 
     */
    public role_add_service( role_node: AclTreeNode, backendServiceModel: AclServiceModel ) {
        // Add service entity to role
        this.store.dispatch( new RolesStateActions.Add_Service( role_node.uid, backendServiceModel ) ).toPromise()
            // Store in updated role in backend
            .then( () => {
                const role_entity = this.store.selectSnapshot( AclEntitiesSelectors.entity_get_fromUid( role_node.uid, NODE_TYPES.ROLE ) )
                const role_model: AclRoleModel = this.store.selectSnapshot( RolesSelectors.role_get_denormalizeEntity( role_entity as AclRoleEntity ) )
                this.backendApi_store_role( role_model )
                    .then( ( result ) => {
                        this.store.dispatch( new RolesStateActions.Add_Service_Success( role_node.uid, backendServiceModel ) )
                    } )
                    .catch( err => {
                        this.store.dispatch( [
                            new RolesStateActions.Add_Service_Error( err ),
                            new Application_Event_Notification( new ApplicationNotification( err.message, 'Backend_AclRoleAddService', ApplicationNotificationType.ERROR ) )
                        ] )
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
        const roleObject: AclRoleModel = {
            uid: uuid(), //IMPORTANT: We set here the UUID of the node because we need to know it later to get role entity and role model
            name: role_name,
            _id: role_name,
            services: [] // As it is a new role, we are sure that there is no attached services
        }
        this.store.dispatch( new RolesStateActions.Add_Entity( roleObject ) ).toPromise()
            .then( result => {
                const role_entity = this.store.selectSnapshot( AclEntitiesSelectors.entity_get_fromUid( roleObject.uid, NODE_TYPES.ROLE ) )
                const role_model: AclRoleModel = this.store.selectSnapshot( RolesSelectors.role_get_denormalizeEntity( role_entity as AclRoleEntity ) )
                this.backendApi_store_role( role_model )
                    .then( result => {
                        this.store.dispatch( new RolesStateActions.Add_Entity_Success( roleObject ) )
                    } )
                    .catch( err => {
                        this.store.dispatch( [
                            new RolesStateActions.Add_Entity_Error( err ),
                            new Application_Event_Notification( new ApplicationNotification( err.message, 'Backend_AclAddRole', ApplicationNotificationType.ERROR ) )
                        ] )
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
    public roles_remove_entity( role: AclTreeNode ) {
        this.store.dispatch( new RolesStateActions.Remove_Entity( role.uid ) ).toPromise()
            .then( result => {
                this.rolesService.delete( role.name )
                    .then( result => {
                        this.store.dispatch( new RolesStateActions.Remove_Entity_Success( role.uid ) )
                    } )
                    .catch( err => {
                        this.store.dispatch( [
                            new RolesStateActions.Remove_Entity_Error( err ),
                            new Application_Event_Notification( new ApplicationNotification( err.message, 'Backend_AclRemoveRole', ApplicationNotificationType.ERROR ) )
                        ] )
                    } )
            } )
            .catch( err => { } )

    }

}