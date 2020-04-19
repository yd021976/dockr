import { State, Action, StateContext } from "@ngxs/store";
import { AclStateEntitiesModel, AclEntities } from "src/app/shared/models/acl.entities.model";
import { NormalizrSchemas } from "../entities-management/normalizer";
import { RolesStateActions } from "../../../actions/acl2/acl2.role.entity.actions"
import { normalize } from "normalizr";
import * as _ from 'lodash';
import { Acl_Field_Update_Allowed, Acl_Field_Update_Allowed_Success, Acl_Field_Update_Allowed_Error } from "../../../actions/acl2/acl2.field.entity.action";
import { ServiceFieldEntity } from "src/app/shared/models/acl.service.field.model";
import { AclServiceActionModelEntity } from "src/app/shared/models/acl.service.action.model";
import { entity_management } from '../utils';
import { Acl_Action_Update_Allowed, Acl_Action_Update_Allowed_Success, Acl_Action_Update_Allowed_Error } from "../../../actions/acl2/acl2.action.entity.actions";
import { Acl_Services_Remove_Entity, Acl_Services_Remove_Entity_Error, Acl_Services_Remove_Entity_Success } from "../../../actions/acl2/acl2.service.entity.actions";
import { Injectable } from "@angular/core";
import { ApplicationActions } from "../../../actions/application.actions";


const default_state = {
    entities: {
        roles: {},
        services: {},
        actions: {},
        fields: {}
    },
    previous_entities: null
}

@State<AclStateEntitiesModel>({
    name: 'acl2Entities',
    defaults: default_state
})

@Injectable()
export class AclEntitiesState {
    // define entities schemas
    static readonly normalizr_utils: NormalizrSchemas = new NormalizrSchemas()

    constructor() {}

    @Action(ApplicationActions.Application_Reset_State)
    reset_state(ctx: StateContext<AclStateEntitiesModel>, action: ApplicationActions.Application_Reset_State) {
        ctx.setState(default_state)
    }
    /*******************************************************************************************************************************************************************
     *                                                              Load entities
     *******************************************************************************************************************************************************************/

    /**
     * 
     */
    @Action(RolesStateActions.Load_All)
    acl_load_all(ctx: StateContext<AclStateEntitiesModel>, action: RolesStateActions.Load_All) {
        ctx.patchState({
            entities: {
                roles: {},
                services: {},
                actions: {},
                fields: {}
            },
            previous_entities: null,
        })
    }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(RolesStateActions.Load_All_Success)
    acl_load_all_success(ctx: StateContext<AclStateEntitiesModel>, action: RolesStateActions.Load_All_Success) {
        var normalized = AclEntitiesState.normalizr_utils.normalize(action.roles, AclEntitiesState.normalizr_utils.mainSchema)

        ctx.patchState({
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
    @Action(RolesStateActions.Load_All_Error)
    acl_load_all_error(ctx: StateContext<AclStateEntitiesModel>, action: RolesStateActions.Load_All_Error) {
        ctx.patchState({
            previous_entities: null,
            entities: {
                roles: {},
                services: {},
                actions: {},
                fields: {}
            },
        })
    }


    /*******************************************************************************************************************************************************************
     *                                                     Role entities -- ADD role entity
     *******************************************************************************************************************************************************************/

    @Action(RolesStateActions.Add_Entity)
    roles_add_entity(ctx: StateContext<AclStateEntitiesModel>, action: RolesStateActions.Add_Entity) {
        const normalized = normalize([action.roleEntity], AclEntitiesState.normalizr_utils.mainSchema)
        const role_entities = normalized.entities['roles'] ? normalized.entities['roles'] : {}
        const service_entities = normalized.entities['services'] ? normalized.entities['services'] : {}
        const actions_entities = normalized.entities['crud_operations'] ? normalized.entities['crud_operations'] : {}
        const fields_entities = normalized.entities['fields'] ? normalized.entities['fields'] : {}
        const previous_entities = _.cloneDeep(ctx.getState().entities)

        ctx.patchState({
            previous_entities: previous_entities,
            entities: {
                roles: { ...ctx.getState().entities.roles, ...role_entities },
                services: { ...ctx.getState().entities.services, ...service_entities },
                actions: { ...ctx.getState().entities.actions, ...actions_entities },
                fields: { ...ctx.getState().entities.fields, ...fields_entities }
            }
        })
    }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(RolesStateActions.Add_Entity_Success)
    roles_add_entity_success(ctx: StateContext<AclStateEntitiesModel>, action: RolesStateActions.Add_Entity_Success) {
        ctx.patchState({ previous_entities: null })
    }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(RolesStateActions.Add_Entity_Error)
    roles_add_entity_error(ctx: StateContext<AclStateEntitiesModel>, action: RolesStateActions.Add_Entity_Error) {
        const previous_entities: AclEntities = ctx.getState().previous_entities != null ? ctx.getState().previous_entities : ctx.getState().entities
        ctx.patchState({
            entities: previous_entities,
            previous_entities: null
        })
    }


    /*******************************************************************************************************************************************************************
     *                                                  Role entities -- REMOVE role entity
     *******************************************************************************************************************************************************************/
    @Action(RolesStateActions.Remove_Entity)
    role_remove_entity(ctx: StateContext<AclStateEntitiesModel>, action: RolesStateActions.Remove_Entity) {
        const state = ctx.getState()
        const previous_entities: AclEntities = _.cloneDeep(state.entities)

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
            previous_entities: previous_entities,
            entities: {
                roles: { ...state.entities.roles },
                services: { ...state.entities.services },
                actions: { ...state.entities.actions },
                fields: { ...state.entities.fields }
            }
        })
    }
    /**
     * Remove role entity from state
     * @param ctx 
     * @param action 
     */
    @Action(RolesStateActions.Remove_Entity_Success)
    roles_remove_entity_success(ctx: StateContext<AclStateEntitiesModel>, action: RolesStateActions.Remove_Entity_Success) {
        ctx.patchState({
            previous_entities: null
        })

    }
    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(RolesStateActions.Remove_Entity_Error)
    roles_remove_entity_error(ctx: StateContext<AclStateEntitiesModel>, action: RolesStateActions.Remove_Entity_Error) {
        const previous_entities: AclEntities = ctx.getState().previous_entities != null ? ctx.getState().previous_entities : ctx.getState().entities
        ctx.patchState({
            entities: previous_entities,
            previous_entities: null
        })
    }



    /*******************************************************************************************************************************************************************
     *                                                  Role entities -- ADD service entity
     *******************************************************************************************************************************************************************/

    /**
    * 
    * @param ctx 
    * @param action 
    */
    @Action(RolesStateActions.Add_Service)
    role_add_service(ctx: StateContext<AclStateEntitiesModel>, action: RolesStateActions.Add_Service) {
        var normalizedEntities = normalize(action.backendServiceModel, AclEntitiesState.normalizr_utils.serviceSchema)
        const serviceUid = normalizedEntities.result
        var state = ctx.getState()

        // Save current state entities
        let previous_entities = _.cloneDeep(state.entities)

        // Update role entity
        var roleEntity = state.entities.roles[action.roleUid]
        roleEntity.services.push(serviceUid)

        ctx.patchState({
            entities: {
                roles: { ...state.entities.roles },
                services: { ...state.entities.services, ...normalizedEntities.entities['services'] },
                actions: { ...state.entities.actions, ...normalizedEntities.entities['crud_operations'] },
                fields: { ...state.entities.fields, ...normalizedEntities.entities['fields'] }
            },
            previous_entities: previous_entities
        })
    }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(RolesStateActions.Add_Service_Success)
    role_add_service_success(ctx: StateContext<AclStateEntitiesModel>, action: RolesStateActions.Add_Service_Success) {
        ctx.patchState({ previous_entities: null })
    }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(RolesStateActions.Add_Service_Error)
    Acl_Role_Add_Service_Error(ctx: StateContext<AclStateEntitiesModel>, action: RolesStateActions.Add_Service_Error) {
        const previous_state = ctx.getState().previous_entities
        ctx.patchState({ entities: previous_state || ctx.getState().entities, previous_entities: null })
    }





    /*******************************************************************************************************************************************************************
    *                                                  Field entities -- Update entity
    *******************************************************************************************************************************************************************/


    /**
    * 
    * @param ctx 
    * @param action 
    */
    @Action(Acl_Field_Update_Allowed)
    field_update_property_allowed(ctx: StateContext<AclStateEntitiesModel>, action: Acl_Field_Update_Allowed) {
        const state: AclStateEntitiesModel = ctx.getState()
        var field_entity: ServiceFieldEntity = state.entities.fields[action.entity_uid]
        var parent_action_entity: AclServiceActionModelEntity = null

        // Save current state entities
        let previous_entities = _.cloneDeep(state.entities)

        // Upate field entity
        field_entity.allowed = action.allowed

        // Get the root field if action uid field is a child. Default is action <uid> property
        var parent_field_uid: string = (entity_management.fields.field_get_root_field(action.entity_uid, state.entities.fields)).uid

        // Get the parent "action" entity
        parent_action_entity = entity_management.fields.field_get_parent_action(parent_field_uid, state.entities.actions)

        // Update allowed property for this field and all his descendants/parents allowed property
        entity_management.fields.field_update_allowed(action.entity_uid, action.allowed, state.entities.fields)

        // Update action allowed state
        entity_management.actions.action_update_allowed(parent_action_entity.uid, state.entities.actions, state.entities.fields)

        ctx.patchState({
            entities: {
                roles: { ...state.entities.roles },
                services: { ...state.entities.services },
                actions: { ...state.entities.actions, [parent_action_entity.uid]: parent_action_entity },
                fields: { ...state.entities.fields, [action.entity_uid]: field_entity }
            },
            previous_entities: previous_entities
        })
    }
    /**
     * Update field "allowed" property and update parent fields and action entities
     * @param ctx 
     * @param action 
     */
    @Action(Acl_Field_Update_Allowed_Success)
    field_update_property_allowed_success(ctx: StateContext<AclStateEntitiesModel>, action: Acl_Field_Update_Allowed_Success) {
        ctx.patchState({ previous_entities: null })
    }

    /**
     * Error after updating, roll back entities to previous state
     * 
     * @param ctx 
     * @param action 
     */
    @Action(Acl_Field_Update_Allowed_Error)
    field_update_property_allowed_error(ctx: StateContext<AclStateEntitiesModel>, action: Acl_Field_Update_Allowed_Error) {
        let state = ctx.getState()
        ctx.patchState({
            entities: state.previous_entities,
            previous_entities: null
        })
    }


    /*******************************************************************************************************************************************************************
    *                                                  Action entities -- Update entity
    *******************************************************************************************************************************************************************/

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(Acl_Action_Update_Allowed)
    action_update_property_allowed(ctx: StateContext<AclStateEntitiesModel>, action: Acl_Action_Update_Allowed) {
        const state: AclStateEntitiesModel = ctx.getState()
        var action_entity: AclServiceActionModelEntity = state.entities.actions[action.entity_uid]

        // Save current state entities
        let previous_entities = _.cloneDeep(state.entities)

        // Update action entity
        action_entity.allowed = action.allowed

        // Update fields entities
        action_entity.fields.forEach((field_uid) => {
            state.entities.fields[field_uid].allowed = action.allowed
            entity_management.fields.field_update_allowed(field_uid, action.allowed, state.entities.fields)
        })

        ctx.patchState({
            previous_entities: previous_entities,
            entities: {
                roles: { ...state.entities.roles },
                services: { ...state.entities.services },
                actions: { ...state.entities.actions, [action.entity_uid]: action_entity },
                fields: { ...state.entities.fields }
            }
        })
    }
    /**
     * @param ctx 
     * @param action 
     */
    @Action(Acl_Action_Update_Allowed_Success)
    action_update_property_allowed_success(ctx: StateContext<AclStateEntitiesModel>, action: Acl_Action_Update_Allowed_Success) {
        ctx.patchState({ previous_entities: null })
    }
    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(Acl_Action_Update_Allowed_Error)
    action_update_property_allowed_error(ctx: StateContext<AclStateEntitiesModel>, action: Acl_Action_Update_Allowed_Error) {
        let state = ctx.getState()
        ctx.patchState({
            entities: state.previous_entities,
            previous_entities: null
        })
    }


    /*******************************************************************************************************************************************************************
    *                                                  Service entities -- Remove entity
    *******************************************************************************************************************************************************************/
    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(Acl_Services_Remove_Entity)
    services_remove_entity(ctx: StateContext<AclStateEntitiesModel>, action: Acl_Services_Remove_Entity) {
        const state: AclStateEntitiesModel = ctx.getState()
        const previous_entities_state: AclEntities = _.cloneDeep(state.entities)

        try {
            // Remove service entity and all children (actions & fields), then remove service uid reference from role
            entity_management.services.service_remove_entity(action.service_uid, state.entities.roles, state.entities.services, state.entities.actions, state.entities.fields)

            // Update state
            ctx.patchState({
                previous_entities: previous_entities_state,
                entities: {
                    roles: { ...state.entities.roles },
                    services: { ...state.entities.services },
                    actions: { ...state.entities.actions },
                    fields: { ...state.entities.fields }
                }
            })
        } catch (e) {
            ctx.dispatch(new Acl_Services_Remove_Entity_Error(e.message))
        }
    }
    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(Acl_Services_Remove_Entity_Success)
    services_remove_entity_success(ctx: StateContext<AclStateEntitiesModel>, action: Acl_Services_Remove_Entity_Success) {
        // Update state
        ctx.patchState({
            previous_entities: null
        })
    }

    @Action(Acl_Services_Remove_Entity_Error)
    services_remove_entity_error(ctx: StateContext<AclStateEntitiesModel>, action: Acl_Services_Remove_Entity_Error) {
        const current_state: AclStateEntitiesModel = ctx.getState()

        // Sets new state entities : If a previous entities state exist, then get it to rollback state, if not keep current state entities
        const state_entities_update: AclEntities = current_state.previous_entities != null ? current_state.previous_entities : current_state.entities

        // Rollback state to previous state if a previous state is set
        ctx.patchState({
            entities: state_entities_update,
            previous_entities: null
        })
    }

}