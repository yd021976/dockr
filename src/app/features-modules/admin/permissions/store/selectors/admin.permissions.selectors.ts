import { Selector, createSelector } from '@ngxs/store';
import { AdminPermissionsEntitiesState } from '../state/entities/admin.permissions.entities.state';
import { AdminPermissionsStateModel, AdminPermissionsEntitiesTypes, AdminPermissionsEntityTypes, AdminPermissionsStateEntities, ENTITY_TYPES } from '../models/admin.permissions.model';
import {merge} from 'lodash';

export class AdminPermissionsStateSelectors {

    public static getChildren(node: AdminPermissionsEntityTypes = null) {
        return createSelector([AdminPermissionsEntitiesState], (state: AdminPermissionsStateModel): AdminPermissionsEntityTypes[] => {
            const node_type: string | null = node !== null ? node.constructor.name : null
            let children: AdminPermissionsEntityTypes[] = []

            let entitiesToMap: AdminPermissionsEntitiesTypes | AdminPermissionsStateEntities
            let entityChildren: string
            const parent_entity: AdminPermissionsEntityTypes | AdminPermissionsStateEntities = node === null ? state.entities : node

            switch (node_type) {
                case "AdminPermissionsRoleEntity":
                    entitiesToMap = state.entities.services
                    entityChildren = 'services'
                    break
                case "AdminPermissionsServiceEntity":
                    entityChildren = 'operations'
                    entitiesToMap = state.entities.operations
                    break
                case "AdminPermissionsOperationEntity":
                    entityChildren = 'fields'
                    entitiesToMap = state.entities.fields
                    break
                case "AdminPermissionsFieldEntity":
                    entityChildren = 'fields'
                    entitiesToMap = state.entities.fields
                    break
                default: /** if no entity input parameter, then return root entities 'roles' */
                    entityChildren = 'root_results'
                    entitiesToMap = state.entities.roles
                    break
            }

            /** get children entities */
            children = Object.values(parent_entity[entityChildren])
                .map((entity_uid: string) => {
                    return entitiesToMap[entity_uid]
                })
            return children
        })
    }


    /**
     * Is state dirty
     */
    @Selector([AdminPermissionsStateSelectors.getDirtyEntities])
    public static isDirty(state: AdminPermissionsStateModel, dirties): boolean {
        const dirty = Object.keys(dirties).length
        return dirty !== 0
    }

    /**
     * is an entity is dirty 
     */
    public static isEntityDirty(entity: AdminPermissionsEntityTypes) {
        return createSelector([AdminPermissionsStateSelectors.getDirtyEntities], (dirties:AdminPermissionsEntityTypes): boolean => {
            
            let isDirty: boolean = false
            if (dirties[entity.uid]) isDirty = true
            return isDirty
        })
    }

    /**
    * Get dirty entities
    */
    @Selector([AdminPermissionsEntitiesState])
    public static getDirtyEntities(state: AdminPermissionsStateModel): AdminPermissionsEntitiesTypes {
        const dirties = merge({},{...state.dirty_entities.added}, {...state.dirty_entities.removed}, {...state.dirty_entities.updated})
        return dirties
    }

    /**
     * Get dirty Role entities
     */
    @Selector([AdminPermissionsEntitiesState])
    public static getDirtyRoles(state: AdminPermissionsStateModel): AdminPermissionsEntitiesTypes {
        const getParent = (entity: AdminPermissionsEntityTypes, state: AdminPermissionsStateModel): AdminPermissionsEntityTypes => {
            /** if entity has no parent, return null */
            if (entity.parent_entity_meta.type === null) return null
            return state.entities[entity.parent_entity_meta.storage_key][entity.parent_entity_meta.uid]
        }

        let dirty_roles: AdminPermissionsEntitiesTypes = {}

        Object.values(state.dirty_entities).forEach((entity: AdminPermissionsEntityTypes) => {
            if (entity.entity_type === ENTITY_TYPES.ROLE) {
                dirty_roles[entity.uid] = entity
            } else {
                /** get role for entity */
                let parent = getParent(entity, state)
                while (parent !== null) {
                    if (parent.entity_type === ENTITY_TYPES.ROLE) {
                        if (!dirty_roles[parent.uid]) {
                            dirty_roles[parent.uid] = parent
                        }
                    }
                    parent = getParent(parent, state)
                }
            }
        })
        return dirty_roles
    }


    // public static denormalized_role(role_entity: AdminPermissionsRoleEntity) {
    //     return createSelector([AdminPermissionsEntitiesState], (state: AdminPermissionsStateModel): any => {
    //         const denormalizr = new AdminPermissionsNormalizrSchemas()
    //         const denormalized_entity = denormalizr.denormalize(role_entity, denormalizr.roleSchema, state.entities)
    //         return denormalized_entity
    //     })
    // }
}