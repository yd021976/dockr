import { AdminPermissionsBaseEntityUtility } from "./admin.permissions.entity.utilities.base";
import { AdminPermissionsEntityTypes, ALLOWED_STATES, AdminPermissionsEntitiesTypes } from "../../../models/admin.permissions.model";
import { Inject } from "@angular/core";
import { AdminPermissionsEntityDataService } from "./admin.permissions.entity.data.service";


/**
 * Class utility to work on state entities : Should be used to extend NGXS 'state' class
 * IMPORTANT : You MUST set the 'entities' property before using any method
 */
export class AllowedProperty extends AdminPermissionsBaseEntityUtility {
    constructor(@Inject(AdminPermissionsEntityDataService) entity_data_service: AdminPermissionsEntityDataService) {
        super(entity_data_service)
    }
    /**
    * Update entity allowed property, update all decendants children, update parents allowed property
    * IMPORTANT : Assume dirty entities are reset to empty
    * @param entity 
    * @param allowed_value 
    */
    public update_entity_allowed_property(entity: AdminPermissionsEntityTypes, allowed_value: ALLOWED_STATES): AdminPermissionsEntitiesTypes {
        let entity_from_entities: AdminPermissionsEntityTypes = this.entity_data_service.entities[entity.storage_key][entity.uid]
        /** 1: update entity */
        entity_from_entities.allowed = allowed_value
        this.entity_data_service.dirty_entities[entity_from_entities.uid] = entity_from_entities

        /** 2: update children */
        this.update_children_entity_allowed_property(entity, allowed_value)

        /** 3: update parents */
        this.update_parents_entity_allowed_property(entity, allowed_value)

        /** Return dirty entities */
        return this.entity_data_service.dirty_entities
    }


    // /**
    //  * get siblings entity from an entity
    //  * 
    //  * @param entity 
    //  */
    // private get_siblings(entity: AdminPermissionsEntityTypes): AdminPermissionsEntityTypes[] {
    //     const parent_entity: AdminPermissionsEntityTypes = this.getParent(entity)
    //     if (parent_entity === null) return []

    //     const siblingsUidArray: EntityChildren = this.entities[entity.parent_entity_meta.storage_key][entity.parent_entity_meta.uid][entity.parent_entity_meta.children_key]
    //     const children_entities: AdminPermissionsEntityTypes[] = this.entities[entity.parent_entity_meta.children_key]
    //     const siblings: AdminPermissionsEntityTypes[] = Object.values(children_entities).filter((child_entity) => {
    //         return siblingsUidArray.find((sibling_entity_uid) => {
    //             return child_entity.uid === sibling_entity_uid
    //         })
    //     })
    //     return siblings === undefined ? [] : siblings
    // }


    /**
     * Compute the parent allowed property value from an entity
     * 
     * @param entity 
     */
    private compute_parent_allowed_property(entity: AdminPermissionsEntityTypes): ALLOWED_STATES {
        let allowed: ALLOWED_STATES = entity.allowed
        const siblings: AdminPermissionsEntityTypes[] = this.getSiblings(entity)

        if (siblings !== null && siblings.length !== 0) {
            const sibling_allowed_status: ALLOWED_STATES = allowed
            /** if one of siblings entities has different allowed value, then parent is "indeterminate" */
            siblings.some((entity) => {
                if (entity.allowed !== sibling_allowed_status) {
                    allowed = ALLOWED_STATES.INDETERMINATE
                    return true /** exit loop */
                }
            })
        }
        return allowed
    }

    /**
     * Return entity children entities from working entities collection
     * 
     * @param entity 
     */
    // private entity_get_children(entity: AdminPermissionsEntityTypes): AdminPermissionsEntityTypes[] {
    //     const children: EntityChildren = entity[entity.children_entities_meta.storage_key]

    //     /** Return array of children entities from working 'entities' collection */
    //     const entities_children_collection: AdminPermissionsEntitiesTypes = this.entities[entity.children_entities_meta.storage_key]
    //     let entity_children = Object.values(entities_children_collection).filter((children_entity: AdminPermissionsEntityTypes) => {
    //         return children.find((child_key: string) => {
    //             return child_key === children_entity.uid
    //         })
    //     })
    //     return entity_children || []
    // }


    /**
     * 
     * @param entity 
     * @param allowed_value 
     */
    private update_parents_entity_allowed_property(entity: AdminPermissionsEntityTypes, allowed_value: ALLOWED_STATES): void {
        let parent_entity: AdminPermissionsEntityTypes = this.getParent(entity)
        let entity_from_entities = this.entity_data_service.entities[entity.storage_key][entity.uid]
        let parent_allowed_property: ALLOWED_STATES

        while (parent_entity !== null) {
            /** Update parent property ONLY if it has allowed property supported (i.e. Not null) */
            if (parent_entity.allowed !== null) {
                parent_allowed_property = this.compute_parent_allowed_property(entity_from_entities)
                if (parent_entity.allowed !== parent_allowed_property) {
                    parent_entity.allowed = parent_allowed_property
                }
            }
            /** as child entity is dirty, consider parent as dirty */
            this.entity_data_service.dirty_entities[parent_entity.uid] = parent_entity

            // Get next parent entity
            entity_from_entities = parent_entity
            parent_entity = this.getParent(entity_from_entities)
        }
    }

    /**
     * 
     * @param entity 
     * @param allowed_value 
     */
    private update_children_entity_allowed_property(entity: AdminPermissionsEntityTypes, allowed_value: ALLOWED_STATES): void {
        /** update children entities in working entities collection */
        let children = this.getChildren(entity)
        children.forEach((child_entity) => {
            if (child_entity.allowed !== allowed_value) {
                child_entity.allowed = allowed_value
                this.entity_data_service.dirty_entities[child_entity.uid] = child_entity
            }
            this.update_children_entity_allowed_property(child_entity, allowed_value)
        })
    }
}