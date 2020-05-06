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
    dirty_entities: {},
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
    /**
     * Return a deep copy of current state entities
     * @param ctx 
     */
    get_cloned_entities(ctx: StateContext<AdminPermissionsStateModel>): AdminPermissionsStateEntities {
        return _.cloneDeep(ctx.getState().entities)
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
        /** Create a copy of current state entities and will also reset class instance dirty entities*/
        this.entity_data_service.entities = this.get_cloned_entities(ctx)

        /** Update allowed value of entities, entity's children and entity's parents */
        const dirty_entities: AdminPermissionsEntitiesTypes = this.update_allowed_property(action.node.item, action.allowed_status)

        /** merge new dirty role entities with current state ones */
        const merged_dirty_entities = _.merge(dirty_entities, ctx.getState().dirty_entities)

        /** update state */
        ctx.setState(
            patch({
                entities: patch({ ...this.entity_data_service.entities }),
                dirty_entities: patch<AdminPermissionsEntitiesTypes>({ ...merged_dirty_entities }) /** those entities should be saved */
            })
        )

        //DEBUG
        const result = ctx.getState()
    }

    @Action(AdminPermissionsRolesStateActions.Add_Entity)
    admin_permissions_role_add_entity(ctx: StateContext<AdminPermissionsStateModel>, action: AdminPermissionsRolesStateActions.Add_Entity) {
        this.entity_data_service.entities = this.get_cloned_entities(ctx) /** ensure we get a fresh copy of state entities to work on */

        /** create role entity */
        const role_entity: AdminPermissionsEntityTypes = this.createEntity({ name: action.entity_name, id: action.entity_name }, null, ENTITY_TYPES.ROLE)
        const merged_dirty_entities = _.merge({ [role_entity.uid]: role_entity }, ctx.getState().dirty_entities)
        const previous_entities = _.cloneDeep(ctx.getState().entities) /** backup entities state to revert on error */

        ctx.setState(
            patch(
                {
                    entities: patch({ roles: patch({ [role_entity.uid]: role_entity }), root_results: append([role_entity.uid]) }),
                    dirty_entities: patch<AdminPermissionsEntitiesTypes>({ ...merged_dirty_entities }),
                    previous_entities: previous_entities
                }
            ))
    }

    @Action(AdminPermissionsRolesStateActions.Add_Service)
    admin_permissions_role_add_service(ctx: StateContext<AdminPermissionsStateModel>, action: AdminPermissionsRolesStateActions.Add_Service) {
        /** init entitites data service */
        this.entity_data_service.reset_dirty_entities()
        this.entity_data_service.entities = this.get_cloned_entities(ctx)
        const previous_entities = _.cloneDeep(ctx.getState().entities) /** backup entities state to revert on error */

        this.role_add_service(action.role_entity, action.service)
        const dirty_entities = _.merge(this.entity_data_service.dirty_entities, ctx.getState().dirty_entities)

        /** Update state */
        ctx.patchState({
            entities: { ...this.entity_data_service.entities },
            dirty_entities: { ...dirty_entities },
            previous_entities: previous_entities
        })
    }
    @Action(AdminPermissionsRolesStateActions.Add_Entity_Success)
    admin_permissions_role_add_entity_success(ctx: StateContext<AdminPermissionsStateModel>, action: AdminPermissionsRolesStateActions.Add_Entity_Success) {
        /**TODO set state isloading to false */
    }


    @Action(AdminPermissionsRolesStateActions.Add_Entity_Error)
    admin_permissions_role_add_entity_error(ctx: StateContext<AdminPermissionsStateModel>, action: AdminPermissionsRolesStateActions.Add_Entity_Error) {
        const previous_entities = _.cloneDeep(ctx.getState().previous_entities)

        ctx.setState(
            patch({
                entities:
                    patch({ ...previous_entities }),
                previous_entities: null
            })
        )
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
            dirty_entities: {}
        })
    }

    /**
     * 
     */
    @Action(AdminPermissionsStateActions.RoleSaved)
    admin_permissions_role_saved(ctx: StateContext<AdminPermissionsStateModel>, action: AdminPermissionsStateActions.RoleSaved) {
        /** get role dirty children entities to update */

        /** */
    }

}