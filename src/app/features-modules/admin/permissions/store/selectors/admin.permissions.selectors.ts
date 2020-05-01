import { Selector, createSelector } from '@ngxs/store';
import { AdminPermissionsEntitiesState } from '../state/entities/admin.permissions.entities.state';
import { AdminPermissionsStateModel, AdminPermissionsEntitiesTypes, AdminPermissionsEntityTypes, AdminPermissionsStateEntities } from '../models/admin.permissions.model';
import { EntityUtilities } from '../entity.management/entity.utilities/admin.permissions.entity.utilities';

export class AdminPermissionsStateSelectors {
    static entities_util: EntityUtilities = new EntityUtilities()

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

    /** list all dirty entities */
    @Selector([AdminPermissionsEntitiesState])
    public static dirtyRoles(state: AdminPermissionsStateModel) {
        return state.dirty_entities
    }
}