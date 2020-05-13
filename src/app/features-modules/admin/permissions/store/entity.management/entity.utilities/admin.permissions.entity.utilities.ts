import {
    AdminPermissionsStateEntities,
    AdminPermissionsEntityTypes,
    ALLOWED_STATES,
    AdminPermissionsRoleEntity,
    EntityChildren,
    AdminPermissionsFieldEntity,
    AdminPermissionsEntitiesTypes,
    ENTITY_TYPES,
    AdminPermissionsStateDirtyEntities,
    AdminPermissionsServiceEntity,
    AdminPermissionParentEntityMeta,
} from '../../models/admin.permissions.model';

import { Schema } from 'normalizr';
import { AllowedProperty } from './internals/admin.permissions.entity.utilities.allowed.prop';
import { AdminPermissionsBaseEntityUtility } from './internals/admin.permissions.entity.utilities.base';
import { AdminPermissionsNormalizrSchemas } from './internals/normalizer';
import { Inject, Injectable } from '@angular/core';
import { AdminPermissionsEntityDataService } from './internals/admin.permissions.entity.data.service';
import { BackendServiceModel } from 'src/app/shared/models/acl.services.model';
import { cloneDeep, merge } from 'lodash';

/**
 * Main "façade" utility service to manage state entities
 * 
 * IMPORTANT This class WILL update service <AdminPermissionsEntityDataService> entities & dirty entities to patch state
 * 
 */
@Injectable()
export class EntityUtilitiesService extends AdminPermissionsBaseEntityUtility {
    protected normalizr: AdminPermissionsNormalizrSchemas
    protected update_allowed_prop: AllowedProperty

    /**
     * 
     */
    constructor(@Inject(AdminPermissionsEntityDataService) entity_data_service) {
        super(entity_data_service)

        /** update entity allowed property*/
        this.update_allowed_prop = new AllowedProperty(entity_data_service)

        /** Normlizer */
        this.normalizr = new AdminPermissionsNormalizrSchemas()
    }

    /** reset dirty entities */
    public resetDirty() {
        this.entity_data_service.reset_dirty_entities()
    }
    /**
     * 
     */
    update_allowed_property(entity: AdminPermissionsEntityTypes, allowed: ALLOWED_STATES) {
        return this.update_allowed_prop.update_entity_allowed_property(entity, allowed)
    }

    normalize(data, schema: Schema) {
        return this.normalizr.normalize(data, schema)
    }
    denormalize(input: AdminPermissionsEntitiesTypes, schema: Schema, entities: AdminPermissionsStateEntities) {
        const entities_array = Object.keys(input)
        const denormalized = this.normalizr.denormalize(entities_array, schema, entities)
        return denormalized
    }

    /**
     * Add a service to a role
     * IMPORTANT Will update entities via state service entities
     * @param role_entity 
     * @param service 
     */
    role_add_service(role_entity: AdminPermissionsRoleEntity, service: BackendServiceModel): void {
        /** create a fake role to normize the service to add to the role */
        let cloned_role = cloneDeep(role_entity)
        cloned_role.services = [service] /** add the service to add to the role */
        const service_entities = this.normalizr.normalize([cloned_role], this.normalizr.mainSchema) /** normalize role to get the normalized service with new UIDs */

        /** Update entities */
        const service_uids = Object.keys(service_entities.entities['services'])
        merge(this.entity_data_service.entities.fields, service_entities.entities['fields'])
        merge(this.entity_data_service.entities.services, service_entities.entities['services'])
        merge(this.entity_data_service.entities.operations, service_entities.entities['operations'])
        let role_updated_entity: AdminPermissionsRoleEntity = this.entity_data_service.entities.roles[role_entity.uid];
        (role_updated_entity.services as EntityChildren).push(...service_uids) /** add new service to role */

        /** update added dirty entities */
        merge(this.entity_data_service.dirty_entities.added, service_entities.entities['services'])
        merge(this.entity_data_service.dirty_entities.added, service_entities.entities['operations'])
        merge(this.entity_data_service.dirty_entities.added, service_entities.entities['fields'])
        merge(this.entity_data_service.dirty_entities.updated, { [role_updated_entity.uid]: role_updated_entity })
    }

    /**
     * Remove service entity from role entity
     * 
     * @param role_entity 
     * @param service 
     */
    role_remove_service(role_entity: AdminPermissionsRoleEntity, service: AdminPermissionsServiceEntity) {
        let entities_to_remove: AdminPermissionsEntityTypes[] = []
        /** Get dirty entities to mark */
        const getEntitiesToRemove = (entities, accumulator) => {
            let children: AdminPermissionsEntityTypes[]

            entities.forEach((entity) => {
                accumulator.push(entity)
                children = this.getChildren(entity)
                if (children.length !== 0) getEntitiesToRemove(children, accumulator)
            })
        }
        const service_entities_to_remove: AdminPermissionsEntityTypes[] = [service]

        getEntitiesToRemove(service_entities_to_remove, entities_to_remove)

        entities_to_remove.forEach((entity) => {
            delete this.entity_data_service.entities[entity.storage_key][entity.uid] /** remove entity from current state */

            /** if entity is currently dirty added or updated, remove it from dirty 'added' or 'updated' and don't add it to 'removed' ones */
            if (this.entity_data_service.dirty_entities.added[entity.uid] || this.entity_data_service.dirty_entities.updated[entity.uid]) {
                delete this.entity_data_service.dirty_entities.added[entity.uid]
                delete this.entity_data_service.dirty_entities.updated[entity.uid]
            } else {
                /** add this entity as "removed" */
                this.entity_data_service.dirty_entities.removed[entity.uid] = cloneDeep(entity)
            }

        })

        /** remove service from role children and mark it as updated */
        this.entity_data_service.entities.roles[role_entity.uid].services.splice(
            this.entity_data_service.entities.roles[role_entity.uid].services.findIndex((uid) => service.uid === uid), 1
        )
        this.entity_data_service.dirty_entities.updated[role_entity.uid] = cloneDeep(role_entity)
    }
    /**
     * Remove a role
     * 
     * @param role_uid 
     */
    role_remove_entity(role_uid: string) {
        /** 
         * Init entities to remove from state 
         */
        /** add all role children to remove */
        const add_children = (entity: AdminPermissionsEntityTypes, accumulator) => {
            let entity_children: AdminPermissionsEntityTypes[]
            accumulator[entity.uid] = entity
            entity_children = this.getChildren(entity)
            Object.values(entity_children).forEach((children_entity) => {
                add_children(children_entity, accumulator)
            })
        }
        let dirty_entities_to_remove: AdminPermissionsEntitiesTypes = {}
        add_children(this.entity_data_service.entities.roles[role_uid], dirty_entities_to_remove)

        /** Clone dirty entities to remove */
        let entities_to_remove = cloneDeep(dirty_entities_to_remove) // entities to remove from current state

        /** 
         * Remove the new entities to remove from current dirty entities to add (i.e. An entity that was marked to add that become marked to remove is no more dirty)
         */
        Object.assign(dirty_entities_to_remove,
            ...Object.keys(dirty_entities_to_remove).filter((uid) => {
                if (this.entity_data_service.dirty_entities.added[uid]) {
                    delete this.entity_data_service.dirty_entities.added[uid] /** as we remove this uid, no need to mark it as added */
                    delete dirty_entities_to_remove[uid] /** this entity uid do not need to be marked as removed */
                }
                if (this.entity_data_service.dirty_entities.updated[uid]) {
                    delete this.entity_data_service.dirty_entities.updated[uid] /** as we remove this uid, no need to mark it as updated , but keep it marked as to remove */
                }
            }))
        /** set dirty entities to remove */
        merge(this.entity_data_service.dirty_entities.removed, dirty_entities_to_remove)


        /**
         * Remove entities from current state
         */
        Object.values(entities_to_remove).forEach((entity) => {
            delete this.entity_data_service.entities[entity.storage_key][entity.uid]
        })
        /** remove role from root_results */
        this.entity_data_service.entities.root_results.splice(this.entity_data_service.entities.root_results.findIndex((uid => uid === role_uid)), 1)
    }

    /**
     * Create an empty role entity with a name
     * 
     * @param role_name 
     */
    role_add_entity(role_name: string) {
        const role_entity = this.createEntity({ name: role_name, _id: role_name }, null, ENTITY_TYPES.ROLE)
        this.entity_data_service.dirty_entities.added[role_entity.uid] = role_entity
        this.entity_data_service.entities.roles[role_entity.uid] = role_entity as AdminPermissionsRoleEntity
        this.entity_data_service.entities.root_results.push(role_entity.uid)
    }

    /**
     * - Unmark role and its children as dirty
     * - Return touched entities
     */
    role_saved(role_uid: string): AdminPermissionsStateDirtyEntities {
        let entities_to_unmark: AdminPermissionsRoleEntity[] = []

        /** build a temporary workspace : add removed dirty entities to entity data service */
        const entities_backup = cloneDeep(this.entity_data_service.entities)
        Object.values(this.entity_data_service.dirty_entities.removed).forEach((entity: AdminPermissionsEntityTypes) => {
            this.entity_data_service.entities[entity.storage_key][entity.uid] = cloneDeep(entity)
        })

        /** Get dirty entities to unmark */
        const getEntitiesToUnmark = (role_uid: string, dirty_entities: AdminPermissionsEntitiesTypes, accumulator) => {
            let parent_entity: AdminPermissionsEntityTypes = null
            Object.values(dirty_entities).forEach((entity: AdminPermissionsEntityTypes) => {
                parent_entity = entity
                while (parent_entity.entity_type !== ENTITY_TYPES.ROLE) {
                    parent_entity = this.getParent(parent_entity)
                }
                /** Add entity to unmark if parent role UID */
                if (parent_entity.uid === role_uid) {
                    accumulator.push(entity)
                }
            })
        }

        /** Get entities to unmark */
        const dirty_entities = merge({}, this.entity_data_service.dirty_entities.added, this.entity_data_service.dirty_entities.updated, this.entity_data_service.dirty_entities.removed)
        getEntitiesToUnmark(role_uid, dirty_entities, entities_to_unmark)

        /** Clone touched entities to return them */
        const touched_entities: AdminPermissionsStateDirtyEntities = { added: {}, updated: {}, removed: {} }

        /** Unmark saved entities  */
        entities_to_unmark.forEach((entity) => {
            if (this.entity_data_service.dirty_entities.added[entity.uid]) {
                touched_entities.added[entity.uid] = cloneDeep(entity)
                delete this.entity_data_service.dirty_entities.added[entity.uid]
            }
            if (this.entity_data_service.dirty_entities.updated[entity.uid]) {
                touched_entities.updated[entity.uid] = cloneDeep(entity)
                delete this.entity_data_service.dirty_entities.updated[entity.uid]
            }
            if (this.entity_data_service.dirty_entities.removed[entity.uid]) {
                touched_entities.removed[entity.uid] = cloneDeep(entity)
                delete this.entity_data_service.dirty_entities.removed[entity.uid]
            }
        })

        /** swap temporary entity data workspace */
        this.entity_data_service.entities = entities_backup
        /** return touched entities */
        return touched_entities
    }
}