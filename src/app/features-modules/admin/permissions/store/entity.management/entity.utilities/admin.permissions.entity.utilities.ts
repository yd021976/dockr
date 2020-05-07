import {
    AdminPermissionsStateEntities,
    AdminPermissionsEntityTypes,
    ALLOWED_STATES,
    AdminPermissionsRoleEntity,
    EntityChildren,
    AdminPermissionsServiceEntity,
    AdminPermissionsFieldEntity,
    AdminPermissionsEntitiesTypes,
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
 * IMPORTANT This class WILL update service <AdminPermissionsEntityDataService> data 
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
    denormalize(input: AdminPermissionsEntityTypes, schema: Schema, entities: AdminPermissionsStateEntities) {
        return this.normalizr.denormalize(input, schema, entities)
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
        merge(this.entity_data_service.entities.operations, service_entities.entities['operations']);
        (this.entity_data_service.entities.roles[role_entity.uid].services as EntityChildren).push(...service_uids) /** add new service to role */

        /** update added dirty entities */
        merge(this.entity_data_service.dirty_entities.added, service_entities.entities['services'])
        merge(this.entity_data_service.dirty_entities.added, service_entities.entities['operations'])
        merge(this.entity_data_service.dirty_entities.added, service_entities.entities['fields'])
        merge(this.entity_data_service.dirty_entities.updated, { [role_entity.uid]: role_entity })
    }

    /**
     * Remove a role
     * 
     * @param role_uid 
     */
    role_remove_entity(role_uid: string) {
        /** function to recursively run in field children to sets dirty entities to remove */
        const add_field = (fields: AdminPermissionsFieldEntity[], accumulator: AdminPermissionsFieldEntity[]) => {
            accumulator.push(...fields)
            fields.forEach((field) => {
                if (field.fields !== null && field.fields.length !== 0) {
                    add_field(this.getChildren(field) as AdminPermissionsFieldEntity[], accumulator)
                }
            })
        }

        /** 
         * Init entities to remove from state 
         */
        /** Roles */
        let removed_roles = { [role_uid]: this.entity_data_service.entities.roles[role_uid] }

        /** Services */
        let removed_services: AdminPermissionsEntitiesTypes = Object.assign({}, ...Object.values(this.entity_data_service.entities.roles[role_uid].services)
            .map((service_uid) => {
                return { [service_uid]: this.entity_data_service.entities.services[service_uid] }
            }))

        /** Operations */
        let operations = [], children = []
        Object.values(removed_services).forEach((service_entity) => {
            children = this.getChildren(service_entity).map((operation_entity) => { return { [operation_entity.uid]: operation_entity } })
            operations.push(...children)
        })
        let removed_operations: AdminPermissionsEntitiesTypes = Object.assign({}, ...operations)

        /** Fields */
        let fields = []
        children = []
        Object.values(removed_operations).forEach((operation_entity) => {
            children = this.getChildren(operation_entity)
            add_field(children, fields)
        })
        let removed_fields: AdminPermissionsEntitiesTypes = Object.assign({}, ...fields.map((field_entity) => { return { [field_entity.uid]: field_entity } }))

        /** merge dirty entities to remove */
        let dirty_entities_to_remove = merge({}, removed_roles, removed_services, removed_operations, removed_fields) // Dirty entities
        let entities_to_remove = cloneDeep(dirty_entities_to_remove) // entities to remove from current stat

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
                    delete this.entity_data_service.dirty_entities.updated[uid] /** as we remove this uid, no need to mark it as added , but keep it marked as to remove */
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
}