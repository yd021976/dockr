import { State, Action, StateContext } from "@ngxs/store";
import { AdminPermissionsNormalizrSchemas } from "../../entity.management/normalizer";
import * as _ from 'lodash';
import { Injectable } from "@angular/core";
import { AdminPermissionsRolesStateActions } from "../../actions/admin.permissions.role.entity.actions";
import { AdminPermissionsStateModel, AdminPermissionsStateEntities, AdminPermissionsRoleEntities, AdminPermissionsEntitiesTypes, AdminPermissionsEntityTypes, ENTITY_TYPES } from "../../models/admin.permissions.model";
import { AdminPermissionsStateActions } from "../../actions/admin.permissions.state.actions";
import { EntityUtilities } from "../../entity.management/entity.utilities/admin.permissions.entity.utilities";
import { patch } from "@ngxs/store/operators";
import { removeEntity } from './admin.permisions.state.operators';

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
export class AdminPermissionsEntitiesState extends EntityUtilities {
    // define entities schemas
    static readonly normalizr_utils: AdminPermissionsNormalizrSchemas = new AdminPermissionsNormalizrSchemas()

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
        var normalized = AdminPermissionsEntitiesState.normalizr_utils.normalize(action.roles, AdminPermissionsEntitiesState.normalizr_utils.mainSchema)

        ctx.patchState({
            entities: {
                root_results: [...normalized.result],
                roles: { ...normalized.entities['roles'] },
                services: { ...normalized.entities['services'] },
                operations: { ...normalized.entities['operations'] },
                fields: { ...normalized.entities['fields'] }
            }
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
        /** Create a copy of current state entities */
        this.entities = this.get_cloned_entities(ctx)

        /** Update allowed value of entities, entity's children and entity's parents */
        const dirty_entities: AdminPermissionsEntitiesTypes = this.update_entity_allowed_property(action.node.item, action.allowed_status)

        /** As we store "role" document in backend, get dirty "role" entities from dirty entities */
        const dirty_role_entities: AdminPermissionsEntitiesTypes = this.dirty_entities_to_role_entities(dirty_entities, ctx.getState())

        /** merge new dirty role entities with current state ones */
        const merged_dirty_entities = _.merge(dirty_role_entities, ctx.getState().dirty_entities)

        /** update state */
        ctx.setState(
            patch({
                entities: patch({ ...this.entities }),
                dirty_entities: patch<AdminPermissionsEntitiesTypes>({ ...merged_dirty_entities }) /** those entities should be saved */
            })
        )

        //DEBUG
        const result = ctx.getState()
    }

    @Action(AdminPermissionsRolesStateActions.Add_Entity)
    admin_permissions_role_add_entity(ctx: StateContext<AdminPermissionsStateModel>, action: AdminPermissionsRolesStateActions.Add_Entity) {
        this.entities = this.get_cloned_entities(ctx) /** ensure we get a fresh copy of state entities to work on */
        const role_entities: AdminPermissionsRoleEntities = this.role_create_entity(action.entity_name) /** create role entity */
        const merged_dirty_entities = _.merge(role_entities, ctx.getState().dirty_entities)
        const previous_entities = _.cloneDeep(ctx.getState().entities)

        ctx.setState(
            patch(
                {
                    dirty_entities: patch({ merged_dirty_entities }),
                    entities: patch({ roles: patch(role_entities) }),
                    previous_entities: previous_entities
                }
            ))
    }


    @Action(AdminPermissionsRolesStateActions.Add_Entity_Success)
    admin_permissions_role_add_entity_success(ctx: StateContext<AdminPermissionsStateModel>, action: AdminPermissionsRolesStateActions.Add_Entity_Success) {
        /**TODO: set state isloading to false */
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
     * Convert a list of any type dirty entities (included roles) to ONLY dirty role entities
     * 
     * @param dirty_entities 
     * @param state_entities 
     */
    private dirty_entities_to_role_entities(dirty_entities: AdminPermissionsEntitiesTypes, state_entities: AdminPermissionsStateModel) {
        /** simple internal function to get parent entity */
        const getParent = (entity: AdminPermissionsEntityTypes, entities: AdminPermissionsStateEntities) => {
            return entities[entity.parentEntity.entitiesKey][entity.parentEntity.uid]
        }

        /** parent role entities to return */
        let dirty_role_entities: AdminPermissionsEntitiesTypes = {}

        Object.values(state_entities.dirty_entities).forEach((entity: AdminPermissionsEntityTypes) => {
            if (entity.entity_type === ENTITY_TYPES.ROLE) {
                dirty_role_entities[entity.uid] = entity
            } else {
                /** get parent role of this child entity */
                while (entity !== null) {
                    entity = getParent(entity, state_entities.entities)
                    if (entity.entity_type === ENTITY_TYPES.ROLE) {
                        /** add role entity if it doesn't exist yet */
                        if (!dirty_role_entities[entity.uid]) {
                            dirty_role_entities[entity.uid] = entity
                        }
                    }
                }
            }
        })
        return dirty_role_entities
    }

}