import { Selector, createSelector } from '@ngxs/store';
import { AdminPermissionsEntitiesState } from '../state/entities/admin.permissions.entities.state';
import { AdminPermissionsStateModel, AdminPermissionsEntitiesTypes, AdminPermissionsEntityTypes, AdminPermissionsStateEntities, ENTITY_TYPES, AdminPermissionsStateDirtyEntities, EntityChildren } from '../models/admin.permissions.model';
import { merge } from 'lodash';

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
    public static isDirty(dirties: AdminPermissionsEntitiesTypes): boolean {
        const dirty = Object.keys(dirties).length
        return dirty !== 0
    }

    /**
     * is an entity is dirty 
     */
    public static isEntityDirty(entity: AdminPermissionsEntityTypes) {
        return createSelector([AdminPermissionsStateSelectors.getDirtyEntities], (dirties: AdminPermissionsEntityTypes): boolean => {

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
        const dirties = merge({}, { ...state.dirty_entities.added }, { ...state.dirty_entities.removed }, { ...state.dirty_entities.updated })
        return dirties
    }

    /**
     * Get dirty Role entities
     */
    @Selector([AdminPermissionsEntitiesState])
    public static getDirtyRoles(state: AdminPermissionsStateModel): AdminPermissionsStateDirtyEntities {
        let dirty_entities: AdminPermissionsStateDirtyEntities = {
            added: {}, removed: {}, updated: {}
        }

        Object.assign(dirty_entities, {
            "added": Object.assign({}, ...Object.values(state.dirty_entities.added)
                .filter((added_entity: AdminPermissionsEntityTypes) => {
                    if (added_entity.entity_type === ENTITY_TYPES.ROLE) {
                        return added_entity
                    }
                })
                .map(entity => { return { [entity.uid]: entity } })
            ),

            "updated": Object.assign({}, ...Object.values(state.dirty_entities.updated)
                .filter((updated_entity: AdminPermissionsEntityTypes) => {
                    if (updated_entity.entity_type === ENTITY_TYPES.ROLE) {
                        return updated_entity
                    }
                })
                .map(entity => { return { [entity.uid]: entity } })
            ),

            "removed": Object.assign({}, ...Object.values(state.dirty_entities.removed)
                .filter((removed_entity: AdminPermissionsEntityTypes) => {
                    if (removed_entity.entity_type === ENTITY_TYPES.ROLE) {
                        return removed_entity
                    }
                })
                .map(entity => { return { [entity.uid]: entity } })
            ),
        })
        return dirty_entities
    }

    public static getNormalizedRole(role_uids: EntityChildren) {
        return createSelector([AdminPermissionsEntitiesState], (state: AdminPermissionsStateModel): AdminPermissionsEntitiesTypes => {
            const denormalized_roles = Object.assign({},
                ...Object.values(state.denormalized)
                    .filter((role_entity: AdminPermissionsEntityTypes) => {
                        if (role_uids.find((uid) => uid === role_entity.uid)) return role_entity
                    })
                    .map((entity) => {
                        return { [entity.uid]: entity }
                    }))
            return denormalized_roles
        })
    }

}