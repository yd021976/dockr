import { State } from "@ngxs/store";
import { Acl2StateModel } from "src/app/shared/models/acl2/acl2.model";
import * as utils from './utils';
import { Action, StateContext, Selector, createSelector } from "@ngxs/store";
import { v4 as uuid } from 'uuid';
import { RoleModel, RoleEntity } from "src/app/shared/models/acl/roles.model";
import { normalize, schema, Schema, denormalize } from 'normalizr'
import { AclTreeNode, NODE_TYPES } from "src/app/shared/models/acl/treenode.model";
import { BackendServiceEntity } from "src/app/shared/models/acl/backend-services.model";
import { CrudOperationModelEntity, ALLOWED_STATES } from "src/app/shared/models/acl/crud-operations.model";
import { DataModelPropertyEntity } from "src/app/shared/models/acl/datamodel.model";
import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";
import { ServicesModel } from "src/app/shared/models/services.model";
import { Acl_LoadAll, Acl_LoadAll_Success, Acl_LoadAll_Error, Acl_node_select } from "../../actions/acl2/acl2.state.actions";
import { Acl_Role_Remove_Entity_Success, Acl_Role_Add_Service_Success, Acl_Role_Add_Entity_Success } from "../../actions/acl2/acl2.role.entity.actions";
import { ServicesState } from "../services.state";
import { Acl_Field_Update_Allowed_Success } from "../../actions/acl2/acl2.field.entity.action";
import { Acl_Actions_Update_Allowed_Success } from "../../actions/acl2/acl2.action.entity.actions";

@State<Acl2StateModel>({
    name: 'acl2',
    defaults: {
        isLoading: false,
        isError: false,
        error: '',
        selectedNode: null,
        entities: {
            roles: {},
            services: {},
            actions: {},
            fields: {}
        }
    }
})
export class Acl2State {
    static readonly schemaOptions = { idAttribute: 'uid', processStrategy: Acl2State.generateUUID }
    // define entities schemas
    static readonly fieldsSchema: Schema = new schema.Entity('fields', {}, Acl2State.schemaOptions)
    static readonly crudOperationsSchema: Schema = new schema.Entity('crud_operations', { fields: [Acl2State.fieldsSchema] }, Acl2State.schemaOptions)
    static readonly serviceSchema: Schema = new schema.Entity('services', { crud_operations: [Acl2State.crudOperationsSchema] }, Acl2State.schemaOptions)
    static readonly roleSchema: Schema = new schema.Entity('roles', { services: [Acl2State.serviceSchema] }, Acl2State.schemaOptions)
    static readonly mainSchema: Schema = new schema.Array(Acl2State.roleSchema)

    public static generateUUID(value) {
        if (!Object.prototype.hasOwnProperty.call(value, 'uid')) value['uid'] = uuid()
        return { ...value }
    }

    @Action(Acl_LoadAll)
    roles_load_all(ctx: StateContext<Acl2StateModel>, action: Acl_LoadAll) {
    }

    @Action(Acl_LoadAll_Success)
    roles_load_all_success(ctx: StateContext<Acl2StateModel>, action: Acl_LoadAll_Success) {
        var normalized = normalize(action.roles, Acl2State.mainSchema)

        ctx.patchState({
            isLoading: false,
            isError: false,
            error: '',
            entities: {
                roles: { ...normalized.entities['roles'] },
                services: { ...normalized.entities['services'] },
                actions: { ...normalized.entities['crud_operations'] },
                fields: { ...normalized.entities['fields'] }
            }
        })
    }
    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(Acl_LoadAll_Error)
    roles_load_all_error(ctx: StateContext<Acl2StateModel>, action: Acl_LoadAll_Error) { }

    @Action(Acl_Role_Add_Entity_Success)
    role_add_entity_success(ctx: StateContext<Acl2StateModel>, action: Acl_Role_Add_Entity_Success) {
        const normalized = normalize([action.roleEntity], Acl2State.mainSchema)
        const role_entities = normalized.entities['roles'] ? normalized.entities['roles'] : {}
        const service_entities = normalized.entities['services'] ? normalized.entities['services'] : {}
        const actions_entities = normalized.entities['crud_operations'] ? normalized.entities['crud_operations'] : {}
        const fields_entities = normalized.entities['fields'] ? normalized.entities['fields'] : {}

        ctx.patchState({
            entities: {
                roles: { ...ctx.getState().entities.roles, ...role_entities },
                services: { ...ctx.getState().entities.services, ...service_entities },
                actions: { ...ctx.getState().entities.actions, ...actions_entities },
                fields: { ...ctx.getState().entities.fields, ...fields_entities }
            }
        })
    }
    /**
     * Remove role entity from state
     * @param ctx 
     * @param action 
     */
    @Action(Acl_Role_Remove_Entity_Success)
    role_remove_role_success(ctx: StateContext<Acl2StateModel>, action: Acl_Role_Remove_Entity_Success) {
        const state = ctx.getState()
        state.entities.roles[action.roleUid].services.forEach((serviceUID) => {
            state.entities.services[serviceUID].crud_operations.forEach((actionUID) => {
                state.entities.actions[actionUID].fields.forEach((fieldUID) => {
                    delete state.entities.fields[fieldUID]
                })
                delete state.entities.actions[actionUID]
            })
            delete state.entities.services[serviceUID]
        })
        delete state.entities.roles[action.roleUid]

        ctx.patchState({
            entities: {
                roles: { ...state.entities.roles },
                services: { ...state.entities.services },
                actions: { ...state.entities.actions },
                fields: { ...state.entities.fields }

            }
        })

    }



    @Action(Acl_Role_Add_Service_Success)
    acl_role_add_service_success(ctx: StateContext<Acl2StateModel>, action: Acl_Role_Add_Service_Success) {
        var normalizedEntities = normalize(action.backendServiceModel, Acl2State.serviceSchema)
        const serviceUid = normalizedEntities.result
        var state = ctx.getState()

        // Update role entity
        var roleEntity = state.entities.roles[action.roleUid]
        roleEntity.services.push(serviceUid)

        ctx.patchState({
            entities: {
                roles: { ...state.entities.roles },
                services: { ...state.entities.services, ...normalizedEntities.entities['services'] },
                actions: { ...state.entities.actions, ...normalizedEntities.entities['crud_operations'] },
                fields: { ...state.entities.fields, ...normalizedEntities.entities['fields'] }
            }
        })
        state = ctx.getState()
    }

    @Action(Acl_Field_Update_Allowed_Success)
    acl_field_update_entity_success(ctx: StateContext<Acl2StateModel>, action: Acl_Field_Update_Allowed_Success) {
        const state: Acl2StateModel = ctx.getState()
        var field_entity: DataModelPropertyEntity = state.entities.fields[action.entity_uid]
        var parent_action_entity: CrudOperationModelEntity = null

        // Find the parent "action" entity
        Object.values(state.entities.actions).forEach((action_entity) => {
            if (action_entity.fields.find((field_uid) => field_uid == action.entity_uid)) {
                parent_action_entity = action_entity
            }
        })

        // Upate field entity
        field_entity.allowed = action.allowed

        // Update action entity
        const allowedFields = parent_action_entity.fields.filter((field_uid) => {
            return state.entities.fields[field_uid].allowed === ALLOWED_STATES.ALLOWED
        })

        // If all fields for the parent action are "allowed", then ensure action is "allowed"
        if (allowedFields.length == parent_action_entity.fields.length) {
            parent_action_entity.allowed = ALLOWED_STATES.ALLOWED
        }
        // No field are allowed, action is not allowed
        else if (allowedFields.length == 0) {
            parent_action_entity.allowed = ALLOWED_STATES.FORBIDDEN
        }
        // Some fields are allowed, but not all -> Action allowed is "intermediate"
        else {
            parent_action_entity.allowed = ALLOWED_STATES.INDETERMINATE
        }

        ctx.patchState({
            entities: {
                roles: { ...state.entities.roles },
                services: { ...state.entities.services },
                actions: { ...state.entities.actions, [parent_action_entity.uid]: parent_action_entity },
                fields: { ...state.entities.fields, [action.entity_uid]: field_entity }
            }
        })
    }

    @Action(Acl_Actions_Update_Allowed_Success)
    acl_action_update_allowed_property_success(ctx: StateContext<Acl2StateModel>, action: Acl_Actions_Update_Allowed_Success) {
        const state: Acl2StateModel = ctx.getState()
        var action_entity: CrudOperationModelEntity = state.entities.actions[action.entity_uid]

        // Update action entity
        action_entity.allowed = action.allowed

        // Update fields entities
        action_entity.fields.forEach((field_uid) => {
            state.entities.fields[field_uid].allowed = action.allowed
        })
        ctx.patchState({
            entities: {
                roles: { ...state.entities.roles },
                services: { ...state.entities.services },
                actions: { ...state.entities.actions, [action.entity_uid]: action_entity },
                fields: { ...state.entities.fields }
            }
        })
    }
    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(Acl_node_select)
    acl_select_node(ctx: StateContext<Acl2StateModel>, action: Acl_node_select) {
        ctx.patchState(
            {
                selectedNode: action.currentNode
            }
        )
    }

    /**
     * 
     * @param node 
     */
    static getTreeNodesData(node: AclTreeNode = null): (...args: any) => AclTreeNode[] {
        return createSelector([Acl2State], (state: Acl2StateModel): AclTreeNode[] => {
            var nodes: AclTreeNode[] = []

            if (node == null) {
                nodes = Object.keys(state.entities.roles).map((value) => {
                    var role = state.entities.roles[value]
                    return {
                        uid: role.uid,
                        name: role.name,
                        type: NODE_TYPES.ROLE
                    }
                })
            } else {
                nodes = Acl2State.getTreeNodeChildren(state, node)
            }
            return nodes
        })

    }
    /**
     * Get children of a node
     * @param state 
     * @param node 
     */
    static getTreeNodeChildren(state: Acl2StateModel, node: AclTreeNode): AclTreeNode[] {
        return utils.getTreeNodeChildren(state, node)
    }


    /**
     * 
     * @param aclstate 
     */
    @Selector()
    static currentRoleEntity(aclstate: Acl2StateModel): RoleEntity {
        return utils.node_getRoleEntity(aclstate.selectedNode, aclstate)
    }

    /**
     * 
     * @param aclState 
     * @param serviceState 
     */
    @Selector([ServicesState])
    static availableRoleServices(aclState: Acl2StateModel, serviceState: ServicesModel) {
        return utils.availableRoleServices(aclState, serviceState)
    }

    /**
     * 
     * @param state 
     */
    @Selector()
    static currentSelectedNode(state: Acl2StateModel): FlatTreeNode {
        return state.selectedNode
    }

    /**
     * 
     * @param state 
     */
    @Selector()
    static currentSelectedNode_UID(state: Acl2StateModel) {
        return state.selectedNode.data['uid']
    }
    static currentSelectedNode_Entity(state: Acl2StateModel): RoleEntity | BackendServiceEntity | CrudOperationModelEntity | DataModelPropertyEntity | null {
        var entity: RoleEntity | BackendServiceEntity | CrudOperationModelEntity | DataModelPropertyEntity = null;
        var nodeuid = state.selectedNode.data['uid']
        entity =
            state.entities.roles[nodeuid]
            || state.entities.services[nodeuid]
            || state.entities.actions[nodeuid]
            || state.entities.fields[nodeuid];

        return entity
    }
    /**
     * Return roles object array (denormalized data)
     * @param state 
     */
    @Selector()
    static getRoles(state: Acl2StateModel): RoleModel[] {
        var rolesUid = Object.keys(state.entities.roles)
        if (rolesUid.length == 0) return []

        var objects = denormalize(rolesUid, Acl2State.mainSchema, {
            roles: state.entities.roles,
            services: state.entities.services,
            crud_operations: state.entities.actions,
            fields: state.entities.fields
        })
        return objects
    }
}