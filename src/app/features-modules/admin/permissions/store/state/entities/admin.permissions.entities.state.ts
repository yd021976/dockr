import { State, Action, StateContext } from "@ngxs/store";
import { AdminPermissionsNormalizrSchemas } from "../../entity.management/normalizer";
import * as _ from 'lodash';
import { Injectable } from "@angular/core";
import { AdminPermissionsRolesStateActions } from "../../actions/admin.permissions.role.entity.actions";
import { AdminPermissionsStateModel, EntityChildren, ALLOWED_STATES, AdminPermissionsStateEntities, AdminPermissionsEntityTypes, AdminPermissionsEntitiesTypes } from "../../models/admin.permissions.model";
import { AdminPermissionsStateActions } from "../../actions/admin.permissions.state.actions";
import { EntityUtilities } from "../../entity.management/entity.utilities/admin.permissions.entity.utilities";

const default_state: AdminPermissionsStateModel = {
    entities: {
        root_results: [],
        roles: {},
        services: {},
        operations: {},
        fields: {}
    },
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
        this.update_entity_allowed_property(action.node.item, action.allowed_status)

        /** update state */
        ctx.patchState({
            entities: { ...this.entities }
        })

        //DEBUG
        const result = ctx.getState()
    }
    /**
     * TODO : Remove below unused methods
     */






    /**
     * Generic method to update allowed status from an entity up to its root parent
     * NOTE : Does not update the entity but only parents
     * 
     * WARN As we are processing objects references of entities input parameter, it will be updated
     * 
     * @param entities 
     * @param entity Entity from start to update
     * @param allowed_status 
     */
    private entity_update_allowed_status_up(
        entities: AdminPermissionsStateEntities, /** will be changed and updated in the method */
        entity: AdminPermissionsEntityTypes,
        allowed_status: ALLOWED_STATES): AdminPermissionsStateEntities {

        const isParentIndeterminate: boolean = this.isParentIndeterminate(entity, entities, allowed_status)
        /** if parent is not indeterminate, assume that the current allowed status of entity is the same for all siblings */
        const allowed_status_to_update: ALLOWED_STATES = isParentIndeterminate ? ALLOWED_STATES.INDETERMINATE : allowed_status

        /** update parent entities recursively */
        let parent = this.getParent(entity, entities)
        while (parent !== null) {
            parent.allowed = parent.allowed !== undefined && parent.allowed !== null ? allowed_status_to_update : undefined /** if allowed status not set, do nothing */
            parent = this.getParent(parent, entities)
        }

        return entities
    }


    /**
     * Generic method to update allowed status from an entity down to its children entities
     * 
     * @param entities 
     * @param entity 
     * @param allowed_status 
     */
    private entity_update_allowed_status_down(
        entities: AdminPermissionsStateEntities,
        entity: AdminPermissionsEntityTypes,
        allowed_status: ALLOWED_STATES): AdminPermissionsStateEntities {

        /** define entity state property name and entity children property name*/
        const entity_type = entity.constructor.name
        let state_entity_prop_name: string = ''
        let children_entities_prop_name: string = ''

        switch (entity_type) {
            case "AdminPermissionsRoleEntity":
                state_entity_prop_name = 'roles'
                children_entities_prop_name = 'services'
                break
            case "AdminPermissionsServiceEntity":
                state_entity_prop_name = 'services'
                children_entities_prop_name = 'operations'
                break
            case "AdminPermissionsOperationEntity":
                state_entity_prop_name = 'operations'
                children_entities_prop_name = 'fields'
                break
            case "AdminPermissionsFieldEntity":
                state_entity_prop_name = 'fields'
                children_entities_prop_name = 'fields'
                break
        }

        //FIXME: Should we must do a complete copy of entities ?
        let updated_entities: AdminPermissionsStateEntities = entities
        updated_entities[state_entity_prop_name][entity.uid].allowed = allowed_status

        /** update entity children allowed property */
        const children: EntityChildren = updated_entities[state_entity_prop_name][entity.uid][children_entities_prop_name]
        let child_entity: AdminPermissionsEntityTypes
        children.forEach((child_entity_uid) => {
            child_entity = updated_entities[children_entities_prop_name][child_entity_uid]
            updated_entities = this.entity_update_allowed_status_down(updated_entities, child_entity, allowed_status)
        })
        return updated_entities
    }

    /**
     * check if a parent entity is in an indeterminate state from a child entity
     * 
     * @param child_entity the child entity to check indeterlinate state from
     * @param entities 
     */
    private isParentIndeterminate(child_entity: AdminPermissionsEntityTypes, entities: AdminPermissionsStateEntities, allowed_status: ALLOWED_STATES): boolean {
        let indeterminate: boolean = false
        const siblings_entities: AdminPermissionsEntityTypes[] = this.getSiblings(child_entity, entities)

        siblings_entities.some((entity) => {
            /** at first 'allowed' difference, we know */
            if (entity.allowed !== allowed_status) {
                indeterminate = true
                return true
            }
        })
        return indeterminate
    }
    /**
     * Get all siblings entities from an entity
     * 
     * @param entity 
     */
    private getSiblings(entity: AdminPermissionsEntityTypes, entities: AdminPermissionsStateEntities): AdminPermissionsEntityTypes[] {
        const parent_entity: AdminPermissionsEntityTypes = this.getParent(entity, entities)
        const parent_entity_type: string = parent_entity.constructor.name
        let parent_entity_children_prop_name: string

        switch (parent_entity_type) {
            case "AdminPermissionsRoleEntity":
                parent_entity_children_prop_name = 'services'
                break
            case "AdminPermissionsServiceEntity":
                parent_entity_children_prop_name = 'operations'
                break
            case "AdminPermissionsOperationEntity":
                parent_entity_children_prop_name = 'fields'
                break
            case "AdminPermissionsFieldEntity":
                parent_entity_children_prop_name = 'fields'
                break
        }

        const parent_children: EntityChildren = parent_entity[parent_entity_children_prop_name] /** array of children uid */
        const siblings: AdminPermissionsEntityTypes[] =
            Object.values(entities[parent_entity_children_prop_name] as AdminPermissionsEntitiesTypes).filter((entity: AdminPermissionsEntityTypes) => {
                return parent_children.find(child_uid => entity.uid === child_uid)
            })


        return siblings
    }

    /**
     * Get entity's parent
     * 
     * @param entity 
     */
    private getParent(entity: AdminPermissionsEntityTypes, entities: AdminPermissionsStateEntities): AdminPermissionsEntityTypes {
        let entity_type = entity.constructor.name
        let parent_entity_name: string
        let parent_children_prop_name: string
        let parent: AdminPermissionsEntityTypes = null
        let field_parent: AdminPermissionsEntityTypes = null

        const getParent = () => {
            const parent_entities: AdminPermissionsEntitiesTypes = entities[parent_entity_name]
            parent = null
            parent = Object.values(parent_entities).find((value: AdminPermissionsEntityTypes) => {
                let found = (value[parent_children_prop_name] as EntityChildren).find((child_uid) => { return child_uid == entity.uid })
                return found
            })
            return parent
        }

        switch (entity_type) {
            case "AdminPermissionsRoleEntity":
                parent_entity_name = ''
                parent_children_prop_name = 'services'
                break
            case "AdminPermissionsServiceEntity":
                parent_entity_name = 'roles'
                parent_children_prop_name = 'services'
                break
            case "AdminPermissionsOperationEntity":
                parent_entity_name = 'services'
                parent_children_prop_name = 'operations'
                break
            case "AdminPermissionsFieldEntity":
                parent_entity_name = 'fields'
                parent_children_prop_name = 'fields'
                /** we must check field has field parent here. If no field parent, then the parent is 'operations' */
                field_parent = getParent()
                if (field_parent === undefined) { /** this means we did not find a parent entity of type "field" */
                    parent_entity_name = 'operations'
                }
                break
        }
        /** return parent entity */
        if (field_parent !== undefined && field_parent !== null) return field_parent
        if (entity_type == 'AdminPermissionsRoleEntity') return null
        return getParent()
    }
}