import { State } from "@ngxs/store";
import { Acl2StateModel } from "src/app/shared/models/acl2/acl2.model";
import { entity_management } from './utils';
import { Action, StateContext, Selector, createSelector } from "@ngxs/store";
import { RoleModel, RoleEntity } from "src/app/shared/models/acl/roles.model";
import { normalize, denormalize } from 'normalizr'
import { AclTreeNode, NODE_TYPES } from "src/app/shared/models/acl/treenode.model";
import { BackendServiceEntity } from "src/app/shared/models/acl/backend-services.model";
import { CrudOperationModelEntity, ALLOWED_STATES } from "src/app/shared/models/acl/crud-operations.model";
import { DataModelPropertyEntity, DataModelPropertyEntities } from "src/app/shared/models/acl/datamodel.model";
import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";
import { ServicesModel } from "src/app/shared/models/services.model";
import { Acl_Load_All, Acl_Load_All_Success, Acl_Load_All_Error, Acl_Tree_Node_Select, Acl_Lock_Resource, Acl_Lock_Resource_Success, Acl_Lock_Resource_Error, Acl_UnLock_Resource, Acl_UnLock_Resource_Success, Acl_UnLock_Resource_Error } from "../../actions/acl2/acl2.state.actions";
import { Acl_Role_Remove_Entity_Success, Acl_Role_Add_Service_Success, Acl_Roles_Add_Entity_Success } from "../../actions/acl2/acl2.role.entity.actions";
import { ServicesState } from "../services.state";
import { Acl_Field_Update_Allowed_Success, Acl_Field_Update_Allowed, Acl_Field_Update_Allowed_Error } from "../../actions/acl2/acl2.field.entity.action";
import { Acl_Action_Update_Allowed_Success } from "../../actions/acl2/acl2.action.entity.actions";
import { Acl_Services_Remove_Entity_Success, Acl_Services_Remove_Entity_Error } from "../../actions/acl2/acl2.service.entity.actions";
import { NormalizrSchemas } from "./entities-management/normalizer";

@State<Acl2StateModel>( {
    name: 'acl2',
    defaults: {
        isLoading: false,
        isError: false,
        error: '',
        isLocked: false,
        selectedNode: null,
        entities: {
            roles: {},
            services: {},
            actions: {},
            fields: {}
        },
        previous_entities: null
    }
} )
export class Acl2State {
    // define entities schemas
    static readonly normalizr_utils: NormalizrSchemas = new NormalizrSchemas()

    constructor() { }
    @Action( Acl_Load_All )
    acl_load_all( ctx: StateContext<Acl2StateModel>, action: Acl_Load_All ) {
    }

    @Action( Acl_Load_All_Success )
    acl_load_all_success( ctx: StateContext<Acl2StateModel>, action: Acl_Load_All_Success ) {
        var normalized = Acl2State.normalizr_utils.normalize( action.roles, Acl2State.normalizr_utils.mainSchema )

        ctx.patchState( {
            isLoading: false,
            isError: false,
            error: '',
            entities: {
                roles: { ...normalized.entities[ 'roles' ] },
                services: { ...normalized.entities[ 'services' ] },
                actions: { ...normalized.entities[ 'crud_operations' ] },
                fields: { ...normalized.entities[ 'fields' ] }
            }
        } )
    }
    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action( Acl_Load_All_Error )
    acl_load_all_error( ctx: StateContext<Acl2StateModel>, action: Acl_Load_All_Error ) { }

    @Action( Acl_Roles_Add_Entity_Success )
    roles_add_entity_success( ctx: StateContext<Acl2StateModel>, action: Acl_Roles_Add_Entity_Success ) {
        const normalized = normalize( [ action.roleEntity ], Acl2State.normalizr_utils.mainSchema )
        const role_entities = normalized.entities[ 'roles' ] ? normalized.entities[ 'roles' ] : {}
        const service_entities = normalized.entities[ 'services' ] ? normalized.entities[ 'services' ] : {}
        const actions_entities = normalized.entities[ 'crud_operations' ] ? normalized.entities[ 'crud_operations' ] : {}
        const fields_entities = normalized.entities[ 'fields' ] ? normalized.entities[ 'fields' ] : {}

        ctx.patchState( {
            entities: {
                roles: { ...ctx.getState().entities.roles, ...role_entities },
                services: { ...ctx.getState().entities.services, ...service_entities },
                actions: { ...ctx.getState().entities.actions, ...actions_entities },
                fields: { ...ctx.getState().entities.fields, ...fields_entities }
            }
        } )
    }
    /**
     * Remove role entity from state
     * @param ctx 
     * @param action 
     */
    @Action( Acl_Role_Remove_Entity_Success )
    roles_remove_entity_success( ctx: StateContext<Acl2StateModel>, action: Acl_Role_Remove_Entity_Success ) {
        const state = ctx.getState()
        state.entities.roles[ action.roleUid ].services.forEach( ( serviceUID ) => {
            state.entities.services[ serviceUID ].crud_operations.forEach( ( actionUID ) => {
                state.entities.actions[ actionUID ].fields.forEach( ( fieldUID ) => {
                    delete state.entities.fields[ fieldUID ]
                } )
                delete state.entities.actions[ actionUID ]
            } )
            delete state.entities.services[ serviceUID ]
        } )
        delete state.entities.roles[ action.roleUid ]

        ctx.patchState( {
            entities: {
                roles: { ...state.entities.roles },
                services: { ...state.entities.services },
                actions: { ...state.entities.actions },
                fields: { ...state.entities.fields }

            }
        } )

    }



    @Action( Acl_Role_Add_Service_Success )
    role_add_service_success( ctx: StateContext<Acl2StateModel>, action: Acl_Role_Add_Service_Success ) {
        var normalizedEntities = normalize( action.backendServiceModel, Acl2State.normalizr_utils.serviceSchema )
        const serviceUid = normalizedEntities.result
        var state = ctx.getState()

        // Update role entity
        var roleEntity = state.entities.roles[ action.roleUid ]
        roleEntity.services.push( serviceUid )

        ctx.patchState( {
            entities: {
                roles: { ...state.entities.roles },
                services: { ...state.entities.services, ...normalizedEntities.entities[ 'services' ] },
                actions: { ...state.entities.actions, ...normalizedEntities.entities[ 'crud_operations' ] },
                fields: { ...state.entities.fields, ...normalizedEntities.entities[ 'fields' ] }
            }
        } )
        state = ctx.getState()
    }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action( Acl_Field_Update_Allowed )
    field_update_property_allowed( ctx: StateContext<Acl2StateModel>, action: Acl_Field_Update_Allowed ) {
        const state: Acl2StateModel = ctx.getState()
        var field_entity: DataModelPropertyEntity = state.entities.fields[ action.entity_uid ]
        var parent_action_entity: CrudOperationModelEntity = null

        // Save current state entities
        let previous_entities = JSON.parse( JSON.stringify( state.entities ) )

        // Upate field entity
        field_entity.allowed = action.allowed

        // Get the root field if action uid field is a child. Default is action <uid> property
        var parent_field_uid: string = ( entity_management.fields.field_get_root_field( action.entity_uid, state.entities.fields ) ).uid

        // Get the parent "action" entity
        parent_action_entity = entity_management.fields.field_get_parent_action( parent_field_uid, state.entities.actions )

        // Update allowed property for this field and all his descendants/parents allowed property
        entity_management.fields.field_update_allowed( action.entity_uid, action.allowed, state.entities.fields )

        // Update action allowed state
        entity_management.actions.action_update_allowed( parent_action_entity.uid, state.entities.actions, state.entities.fields )

        ctx.patchState( {
            isLoading: true,
            entities: {
                roles: { ...state.entities.roles },
                services: { ...state.entities.services },
                actions: { ...state.entities.actions, [ parent_action_entity.uid ]: parent_action_entity },
                fields: { ...state.entities.fields, [ action.entity_uid ]: field_entity }
            },
            previous_entities: previous_entities
        } )
    }
    /**
     * Update field "allowed" property and update parent fields and action entities
     * @param ctx 
     * @param action 
     */
    @Action( Acl_Field_Update_Allowed_Success )
    field_update_property_allowed_success( ctx: StateContext<Acl2StateModel>, action: Acl_Field_Update_Allowed_Success ) {
        ctx.patchState( { isLoading: false } )
    }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action( Acl_Field_Update_Allowed_Error )
    field_update_property_allowed_error( ctx: StateContext<Acl2StateModel>, action: Acl_Field_Update_Allowed_Error ) {
        let state = ctx.getState()
        ctx.patchState( {
            isLoading: false,
            isError: true,
            error: action.error,
            entities: state.previous_entities,
            previous_entities: null
        } )
    }


    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action( Acl_Action_Update_Allowed_Success )
    action_update_property_allowed_success( ctx: StateContext<Acl2StateModel>, action: Acl_Action_Update_Allowed_Success ) {
        const state: Acl2StateModel = ctx.getState()
        var action_entity: CrudOperationModelEntity = state.entities.actions[ action.entity_uid ]

        // Update action entity
        action_entity.allowed = action.allowed

        // Update fields entities
        action_entity.fields.forEach( ( field_uid ) => {
            state.entities.fields[ field_uid ].allowed = action.allowed
            entity_management.fields.field_update_allowed( field_uid, action.allowed, state.entities.fields )
        } )

        ctx.patchState( {
            entities: {
                roles: { ...state.entities.roles },
                services: { ...state.entities.services },
                actions: { ...state.entities.actions, [ action.entity_uid ]: action_entity },
                fields: { ...state.entities.fields }
            }
        } )
    }

    @Action( Acl_Services_Remove_Entity_Success )
    services_remove_entity_success( ctx: StateContext<Acl2StateModel>, action: Acl_Services_Remove_Entity_Success ) {
        const state: Acl2StateModel = ctx.getState()
        try {
            // Remove service entity and all children (actions & fields), then remove service uid reference from role
            entity_management.services.service_remove_entity( action.service_uid, state.entities.roles, state.entities.services, state.entities.actions, state.entities.fields )

            // Update state
            ctx.patchState( {
                entities: {
                    roles: { ...state.entities.roles },
                    services: { ...state.entities.services },
                    actions: { ...state.entities.actions },
                    fields: { ...state.entities.fields }
                }
            } )
        } catch ( e ) {
            ctx.dispatch( new Acl_Services_Remove_Entity_Error( e.message ) )
        }
    }
    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action( Acl_Tree_Node_Select )
    acl_tree_select_node( ctx: StateContext<Acl2StateModel>, action: Acl_Tree_Node_Select ) {
        ctx.patchState(
            {
                selectedNode: action.currentNode
            }
        )
    }


    @Action( Acl_Lock_Resource )
    acl_lock_resource( ctx: StateContext<Acl2StateModel>, action: Acl_Lock_Resource ) {
        ctx.patchState( { isLoading: true } )
    }

    @Action( Acl_Lock_Resource_Success )
    acl_lock_resource_success( ctx: StateContext<Acl2StateModel>, action: Acl_Lock_Resource_Success ) {
        ctx.patchState( { isLocked: true, isError: false, error: '', isLoading: false } )
    }

    @Action( Acl_Lock_Resource_Error )
    acl_lock_resource_error( ctx: StateContext<Acl2StateModel>, action: Acl_Lock_Resource_Error ) {
        ctx.patchState( { isError: true, error: action.error.message, isLoading: false, isLocked: false } )
    }


    @Action( Acl_UnLock_Resource )
    acl_unlock_resource( ctx: StateContext<Acl2StateModel>, action: Acl_UnLock_Resource ) {
        ctx.patchState( { isLoading: true } )
    }
    @Action( Acl_UnLock_Resource_Success )
    acl_unlock_resource_success( ctx: StateContext<Acl2StateModel>, action: Acl_UnLock_Resource_Success ) {
        ctx.patchState( { isLocked: false, isError: false, error: '', isLoading: false } )
    }
    @Action( Acl_UnLock_Resource_Error )
    acl_unlock_resource_error( ctx: StateContext<Acl2StateModel>, action: Acl_UnLock_Resource_Error ) {
        ctx.patchState( { isError: true, error: action.error.message, isLoading: false } )
    }

    /**
     * 
     * @param node 
     */
    static treenode_getData( node: AclTreeNode = null ): ( ...args: any ) => AclTreeNode[] {
        return createSelector( [ Acl2State ], ( state: Acl2StateModel ): AclTreeNode[] => {
            var nodes: AclTreeNode[] = []

            if ( node == null ) {
                nodes = Object.keys( state.entities.roles ).map( ( value ) => {
                    var role = state.entities.roles[ value ]
                    return {
                        uid: role.uid,
                        name: role.name,
                        type: NODE_TYPES.ROLE
                    }
                } )
            } else {
                nodes = Acl2State.treenode_getChildren( state, node )
            }
            return nodes
        } )

    }
    /**
     * Get children of a node
     * @param state 
     * @param node 
     */
    static treenode_getChildren( state: Acl2StateModel, node: AclTreeNode ): AclTreeNode[] {
        return entity_management.treenodes.node_get_children( state, node )
    }


    /**
     * 
     * @param aclstate 
     */
    @Selector()
    static role_get_entityFromCurrentSelectedNode( aclstate: Acl2StateModel ): RoleEntity {
        return entity_management.treenodes.node_get_role_entity( aclstate.selectedNode, aclstate )
    }

    /**
     * Get "role" entity from any node in the tree
     * 
     * @param node Node from wich we want the role entity
     */
    static treenode_get_rootRoleEntity( node: AclTreeNode ): ( ...args: any[] ) => RoleEntity {
        return createSelector( [ Acl2State ], ( state: Acl2StateModel ): RoleEntity => {
            const flatNode: FlatTreeNode = {
                isExpandable: false,
                level: 0,
                data: JSON.parse( JSON.stringify( node ) ) // Ensure new instance of node
            }
            return entity_management.treenodes.node_get_role_entity( flatNode, state )
        } )
    }

    /**
     * Convert a role entity into a denormalized state
     * 
     * @param role_entity The role entity to denormalize
     */
    static role_get_denormalizeEntity( role_entity: RoleEntity ) {
        return createSelector( [ Acl2State ], ( state: Acl2StateModel ): RoleModel => {
            const role_model: RoleModel = Acl2State.normalizr_utils.denormalize( role_entity.uid, Acl2State.normalizr_utils.roleSchema, {
                roles: state.entities.roles,
                services: state.entities.services,
                crud_operations: state.entities.actions,
                fields: state.entities.fields,
            } )
            return role_model
        } )
    }

    /**
     * 
     * @param aclState 
     * @param serviceState 
     */
    @Selector( [ ServicesState ] )
    static role_get_availableServices( aclState: Acl2StateModel, serviceState: ServicesModel ) {
        const role_entity: RoleEntity = entity_management.roles.role_get_entityFromUid( aclState.selectedNode.data.uid, aclState.entities.roles )
        return entity_management.roles.role_get_available_services( role_entity, aclState.entities.services, serviceState )
    }

    /**
     * 
     * @param state 
     */
    @Selector()
    static treenodes_get_currentSelectedNode( state: Acl2StateModel ): FlatTreeNode {
        return state.selectedNode
    }

    /**
     * 
     * @param node 
     */
    static treenodes_get_parentNode( node: AclTreeNode ): ( ...args: any ) => AclTreeNode {
        return createSelector( [ Acl2State ], ( state: Acl2StateModel ): AclTreeNode => {
            var parent: RoleEntity | BackendServiceEntity | CrudOperationModelEntity | DataModelPropertyEntity = null, parent_treeNode: AclTreeNode = null

            switch ( node.type ) {
                case NODE_TYPES.ROLE:
                    break
                case NODE_TYPES.SERVICE:
                    parent = entity_management.services.service_get_parent( node.uid, state.entities.roles )
                    parent_treeNode = {
                        name: parent._id,
                        type: NODE_TYPES.ROLE,
                        uid: parent.uid
                    }
                    break
                case NODE_TYPES.CRUDOPERATION:
                    parent = entity_management.actions.action_get_parent( node.uid, state.entities.services );
                    parent_treeNode = {
                        uid: parent.uid,
                        name: parent.id,
                        type: NODE_TYPES.SERVICE,
                    }

                    break
                // Special case : If field is a child of a field, return the parent field. Else return the parent "action"
                case NODE_TYPES.FIELDACCESS:
                    parent = entity_management.fields.field_get_parent_field( node.uid, state.entities.fields )

                    if ( parent == null ) {
                        // field is not a child of a field, get the "crud operation" parent
                        parent = entity_management.fields.field_get_parent_action( node.uid, state.entities.actions )
                        parent_treeNode = {
                            uid: parent.uid,
                            name: parent.id,
                            type: NODE_TYPES.CRUDOPERATION,
                            checked: parent.allowed
                        }
                    } else {
                        parent_treeNode = {
                            uid: parent.uid,
                            name: parent.id,
                            type: NODE_TYPES.FIELDACCESS,
                            checked: parent.allowed
                        }
                    }
                    break
                default:
                    break
            }
            return parent_treeNode
        } )
    }
    /**
     * Return roles object array (denormalized data)
     * @param state 
     */
    @Selector()
    static roles_get_list( state: Acl2StateModel ): RoleModel[] {
        var rolesUid = Object.keys( state.entities.roles )
        if ( rolesUid.length == 0 ) return []

        var objects = denormalize( rolesUid, Acl2State.normalizr_utils.mainSchema, {
            roles: state.entities.roles,
            services: state.entities.services,
            crud_operations: state.entities.actions,
            fields: state.entities.fields
        } )
        return objects
    }

    @Selector()
    static GetLockState( state: Acl2StateModel ): boolean {
        return state.isLocked
    }
}