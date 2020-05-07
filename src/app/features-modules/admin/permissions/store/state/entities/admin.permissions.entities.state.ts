import { State, Action, StateContext } from "@ngxs/store";
import { AdminPermissionsNormalizrSchemas } from "../../entity.management/entity.utilities/internals/normalizer";
import * as _ from 'lodash';
import { Injectable, Inject } from "@angular/core";
import { AdminPermissionsRolesStateActions } from "../../actions/admin.permissions.role.entity.actions";
import { AdminPermissionsStateModel, AdminPermissionsStateEntities, AdminPermissionsRoleEntities, AdminPermissionsEntitiesTypes, AdminPermissionsEntityTypes, ENTITY_TYPES } from "../../models/admin.permissions.model";
import { AdminPermissionsStateActions } from "../../actions/admin.permissions.state.actions";
import { patch, append } from "@ngxs/store/operators";
import { removeEntity } from './admin.permisions.state.operators';
import { EntityUtilitiesService } from "../../entity.management/entity.utilities/admin.permissions.entity.utilities";
import { AdminPermissionsEntityDataService } from "../../entity.management/entity.utilities/internals/admin.permissions.entity.data.service";

const default_state: AdminPermissionsStateModel = {
    entities: {
        root_results: [],
        roles: {},
        services: {},
        operations: {},
        fields: {}
    },
    dirty_entities: {
        added: {},
        removed: {},
        updated: {}
    },
    previous_entities: null
}

@State<AdminPermissionsStateModel>({
    name: 'AdminPermissionsEntities',
    defaults: default_state
})

@Injectable()
export class AdminPermissionsEntitiesState extends EntityUtilitiesService {
    constructor(@Inject(AdminPermissionsEntityDataService) entity_data_service) {
        super(entity_data_service)
    }

    /*******************************************************************************************************************************************************************
     *                                                              Load entities
     *******************************************************************************************************************************************************************/

    /**
     * 
     */
    @Action(AdminPermissionsRolesStateActions.Load_All)
    admin_permissions_roles_load_all(ctx: StateContext<AdminPermissionsStateModel>, action: AdminPermissionsRolesStateActions.Load_All) {
        ctx.patchState({
            entities: {
                root_results: [],
                roles: {},
                services: {},
                operations: {},
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
    @Action(AdminPermissionsRolesStateActions.Load_All_Success)
    admin_permissions_roles_load_all_success(ctx: StateContext<AdminPermissionsStateModel>, action: AdminPermissionsRolesStateActions.Load_All_Success) {
        var normalized = this.normalize(action.roles, this.normalizr.mainSchema)
        const entities: AdminPermissionsStateEntities = {
            root_results: [...normalized.result],
            roles: { ...normalized.entities['roles'] },
            services: { ...normalized.entities['services'] },
            operations: { ...normalized.entities['operations'] },
            fields: { ...normalized.entities['fields'] }
        }
        /** keep a snapshot of initial entities so we can revert data on error actions */
        const previous_entities: AdminPermissionsStateEntities = _.cloneDeep(entities)

        ctx.patchState({
            entities: { ...entities },
            previous_entities: { ...previous_entities }
        })
    }

    /**
    * 
    * @param ctx 
    * @param action 
    */
    @Action(AdminPermissionsRolesStateActions.Load_All_Error)
    admin_permissions_roles_load_all_error(ctx: StateContext<AdminPermissionsStateModel>, action: AdminPermissionsRolesStateActions.Load_All_Error) {
        ctx.patchState({
            previous_entities: null,
            entities: {
                root_results: [],
                roles: {},
                services: {},
                operations: {},
                fields: {}
            },
        })
    }

    /**
     * 
     */
    @Action(AdminPermissionsStateActions.NodeUpdateAllowedStatus)
    admin_permissions_node_update_allowed(ctx: StateContext<AdminPermissionsStateModel>, action: AdminPermissionsStateActions.NodeUpdateAllowedStatus) {
        /** Init entity service */
        this.init_entity_data_service(ctx)

        /** Update allowed value of entities, entity's children and entity's parents */
        this.update_allowed_property(action.node.item, action.allowed_status)

        /** merge new dirty role entities with current state ones */
        const merged_dirty_entities = _.merge(ctx.getState().dirty_entities, this.entity_data_service.dirty_entities)

        /** update state */
        ctx.setState(
            patch({
                entities: patch({ ...this.entity_data_service.entities }),
                dirty_entities: patch({ ...merged_dirty_entities }),
            })
        )

        //DEBUG
        const result = ctx.getState()
    }

    @Action(AdminPermissionsRolesStateActions.Add_Entity)
    admin_permissions_role_add_entity(ctx: StateContext<AdminPermissionsStateModel>, action: AdminPermissionsRolesStateActions.Add_Entity) {
        this.init_entity_data_service(ctx)

        /** create role entity */
        const role_entity: AdminPermissionsEntityTypes = this.createEntity({ name: action.entity_name, id: action.entity_name }, null, ENTITY_TYPES.ROLE)
        const dirty_entities = _.merge(ctx.getState().dirty_entities, this.entity_data_service.dirty_entities)

        ctx.setState(
            patch({
                entities: patch({ roles: patch({ [role_entity.uid]: role_entity }), root_results: append([role_entity.uid]) }),
                dirty_entities: patch({ ...dirty_entities })
            }))
    }
    @Action(AdminPermissionsRolesStateActions.Remove_Entity)
    admin_permissions_role_remove_entity(ctx: StateContext<AdminPermissionsStateModel>, action: AdminPermissionsRolesStateActions.Remove_Entity) {
        this.init_entity_data_service(ctx)
        /** as we are removing entity and children, we must sets dirties data to entity service so we should remove unsaved pending dirtiy entities */
        const dirties = _.cloneDeep(ctx.getState().dirty_entities)
        this.entity_data_service.dirty_entities = dirties

        /** remove role entity */
        this.role_remove_entity(action.role_entity_uid)

        /** update state */
        ctx.setState(
            patch({
                entities: patch({ ...this.entity_data_service.entities }),
                dirty_entities : patch({...this.entity_data_service.dirty_entities})
            })
        )
    }

    @Action(AdminPermissionsRolesStateActions.Add_Service)
    admin_permissions_role_add_service(ctx: StateContext<AdminPermissionsStateModel>, action: AdminPermissionsRolesStateActions.Add_Service) {
        this.init_entity_data_service(ctx)
        this.role_add_service(action.role_entity, action.service_to_add)
        const dirty_entities = _.merge(ctx.getState().dirty_entities, this.entity_data_service.dirty_entities)

        /** Update state */
        ctx.setState(
            patch({
                entities: patch({ ...this.entity_data_service.entities }),
                dirty_entities:
                    patch({ ...dirty_entities })
            }))

        /**DEBUG */
        const state = ctx.getState()
    }

    /**
     * Cancel state pending changes : Revert state to previous state and clear dirty entities
     */
    @Action(AdminPermissionsStateActions.CancelChanges)
    admin_permissions_cancel_changes(ctx: StateContext<AdminPermissionsStateModel>, action: AdminPermissionsStateActions.CancelChanges) {
        /** Get previous state */
        const previous_entities: AdminPermissionsStateEntities = ctx.getState().previous_entities

        ctx.patchState({
            entities: { ...previous_entities },
            dirty_entities: {
                added: {},
                removed: {},
                updated: {},
            },
        })
    }

    /**
     * 
     */
    @Action(AdminPermissionsStateActions.RoleSaved)
    admin_permissions_role_saved(ctx: StateContext<AdminPermissionsStateModel>, action: AdminPermissionsStateActions.RoleSaved) {

    }

    /**
     * Init entity data service : reset dirties state et set a freshest entities working space from current state 
     * @param ctx 
     * @param reset_dirties True(Default) if dirties must be resetted
     */
    private init_entity_data_service(ctx: StateContext<AdminPermissionsStateModel>, reset_dirties: boolean = true) {
        const entities = this.get_cloned_entities(ctx) /** get cloned entities from current state */
        if (this.resetDirty) this.resetDirty()
        this.entity_data_service.entities = entities
    }
    /**
     * Return a deep copy of current state entities
     * @param ctx 
     */
    private get_cloned_entities(ctx: StateContext<AdminPermissionsStateModel>): AdminPermissionsStateEntities {
        return _.cloneDeep(ctx.getState().entities)
    }
}