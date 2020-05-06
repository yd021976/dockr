import { AdminPermissionsEntityTypes, AdminPermissionsEntitiesTypes, AdminPermissionsEntityRawData, ENTITY_TYPES, EntityChildren } from "../../../models/admin.permissions.model"
import { factory } from "./admin.permissions.entity.factory"
import { Inject } from "@angular/core"
import { AdminPermissionsEntityDataService } from "./admin.permissions.entity.data.service"


export class AdminPermissionEntityManagement {
    constructor(@Inject(AdminPermissionsEntityDataService) protected entity_data_service) {
    }
    /**
     * 
     * @param entity 
     */
    getParent(entity: AdminPermissionsEntityTypes) {
        if (entity.parent_entity_meta === null) return null
        return this.entity_data_service.entities[entity.parent_entity_meta.storage_key][entity.parent_entity_meta.uid]
    }

    /**
     * 
     * @param entity 
     */
    getChildren(entity: AdminPermissionsEntityTypes): AdminPermissionsEntityTypes[] {
        const children: EntityChildren = entity[entity.children_entities_meta.storage_key]

        /** Return array of children entities from working 'entities' collection */
        const entities_children_collection: AdminPermissionsEntitiesTypes = this.entity_data_service.entities[entity.children_entities_meta.storage_key]
        let entity_children = Object.values(entities_children_collection).filter((children_entity: AdminPermissionsEntityTypes) => {
            return children.find((child_key: string) => {
                return child_key === children_entity.uid
            })
        })
        return entity_children || []
    }

    /**
     * 
     */
    getSiblings(entity: AdminPermissionsEntityTypes) {
        const parent_entity: AdminPermissionsEntityTypes = this.getParent(entity)
        if (parent_entity === null) return []

        const siblingsUidArray: EntityChildren = this.entity_data_service.entities[entity.parent_entity_meta.storage_key][entity.parent_entity_meta.uid][entity.parent_entity_meta.children_key]
        const children_entities: AdminPermissionsEntityTypes[] = this.entity_data_service.entities[entity.parent_entity_meta.children_key]
        const siblings: AdminPermissionsEntityTypes[] = Object.values(children_entities).filter((child_entity) => {
            return siblingsUidArray.find((sibling_entity_uid) => {
                return child_entity.uid === sibling_entity_uid
            })
        })
        return siblings === undefined ? [] : siblings
    }


    /**
     * 
     */
    addChildren() { }

    /**
     * Entity factory
     * @param rawdata 
     */
    createEntity(rawdata: AdminPermissionsEntityRawData, parent: AdminPermissionsEntityRawData = null, type: ENTITY_TYPES = null): AdminPermissionsEntityTypes {
        const entity = factory(rawdata, parent, type)
        return entity
    }
}