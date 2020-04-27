import { AdminPermissionsBaseEntityUtility } from "./admin.permissions.entity.utilities.base";
import { AdminPermissionsEntityTypes, EntityChildren, ALLOWED_STATES, AdminPermissionsEntitiesTypes } from "../../../models/admin.permissions.model";


/**
 * Class utility to work on state entities : Should be used to extend NGXS 'state' class
 * IMPORTANT : You MUST set the 'entities' property before using any method
 */
export class AllowedProperty extends AdminPermissionsBaseEntityUtility {
    /**
     * Get the parent entity from an antity
     * 
     * @param entity 
     */
    private get_parent_entity(entity: AdminPermissionsEntityTypes): AdminPermissionsEntityTypes {
        return entity.parentEntity.type !== null ? this.entities[entity.parentEntity.entitiestKey][entity.parentEntity.uid] : null
    }


    /**
     * get siblings entity from an entity
     * 
     * @param entity 
     */
    private get_siblings(entity: AdminPermissionsEntityTypes): AdminPermissionsEntityTypes[] {
        const parent_entity: AdminPermissionsEntityTypes = this.get_parent_entity(entity)
        if (parent_entity === null) return []

        const siblingsUidArray: EntityChildren = this.entities[entity.parentEntity.entitiestKey][entity.parentEntity.uid][entity.parentEntity.childrenKey]
        const children_entities: AdminPermissionsEntityTypes[] = this.entities[entity.parentEntity.childrenKey]
        const siblings: AdminPermissionsEntityTypes[] = Object.values(children_entities).filter((child_entity) => {
            return siblingsUidArray.find((sibling_entity_uid) => {
                return child_entity.uid === sibling_entity_uid
            })
        })
        return siblings === undefined ? [] : siblings
    }


    /**
     * Compute the parent allowed property value from an entity
     * 
     * @param entity 
     */
    private compute_parent_allowed_property(entity: AdminPermissionsEntityTypes): ALLOWED_STATES {
        let allowed: ALLOWED_STATES = entity.allowed
        const siblings: AdminPermissionsEntityTypes[] = this.get_siblings(entity)

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
    private entity_get_children(entity: AdminPermissionsEntityTypes): AdminPermissionsEntityTypes[] {
        const children: EntityChildren = entity[entity.children_key]

        /** Return array of children entities from working 'entities' collection */
        const entities_children_collection: AdminPermissionsEntitiesTypes = this.entities[entity.children_key]
        let entity_children = Object.values(entities_children_collection).filter((children_entity: AdminPermissionsEntityTypes) => {
            return children.find((child_key: string) => {
                return child_key === children_entity.uid
            })
        })
        return entity_children || []
    }


    /**
     * Update entity allowed property, update all decendants children, update parents allowed property
     *  
     * @param entity 
     * @param allowed_value 
     */
    public update_entity_allowed_property(entity: AdminPermissionsEntityTypes, allowed_value: ALLOWED_STATES) {
        let entity_from_entities: AdminPermissionsEntityTypes = this.entities[entity.entitiesKey][entity.uid]
        /** 1: update entity */
        entity_from_entities.allowed = allowed_value

        /** 2: update children */
        this.update_children_entity_allowed_property(entity, allowed_value)

        /** 3: update parents */
        this.update_parents_entity_allowed_property(entity, allowed_value)
    }

    /**
     * 
     * @param entity 
     * @param allowed_value 
     */
    private update_parents_entity_allowed_property(entity: AdminPermissionsEntityTypes, allowed_value: ALLOWED_STATES): void {
        let parent_entity: AdminPermissionsEntityTypes = this.get_parent_entity(entity)
        let entity_from_entities = this.entities[entity.entitiesKey][entity.uid]
        while (parent_entity !== null) {
            /** Update parent property ONLY if it has allowed property supported (i.e. Not null) */
            if (parent_entity.allowed !== null) parent_entity.allowed = this.compute_parent_allowed_property(entity_from_entities)
            // Get next parent entity
            entity_from_entities = parent_entity
            parent_entity = this.get_parent_entity(entity_from_entities)
        }
    }

    /**
     * 
     * @param entity 
     * @param allowed_value 
     */
    private update_children_entity_allowed_property(entity: AdminPermissionsEntityTypes, allowed_value: ALLOWED_STATES): void {
        /** update children entities in working entities collection */
        let children = this.entity_get_children(entity)
        children.forEach((child_entity) => {
            child_entity.allowed = allowed_value
            this.update_children_entity_allowed_property(child_entity, allowed_value)
        })
    }
}