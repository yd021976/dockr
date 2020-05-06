// import { Role } from './internals/admin.permissions.entity.utilities.role';
// import { AdminPermissionsBaseEntityUtility } from './internals/admin.permissions.entity.utilities.base';
// import { Service } from './internals/admin.permissions.entity.utilities.service';
import {
    AdminPermissionsStateEntities,
    AdminPermissionsEntityTypes,
    ALLOWED_STATES,
    AdminPermissionsRoleEntity,
    EntityChildren,
} from '../../models/admin.permissions.model';

import { Schema } from 'normalizr';
import { AllowedProperty } from './internals/admin.permissions.entity.utilities.allowed.prop';
import { AdminPermissionsBaseEntityUtility } from './internals/admin.permissions.entity.utilities.base';
import { AdminPermissionsNormalizrSchemas } from './internals/normalizer';
import { Inject, Injectable } from '@angular/core';
import { AdminPermissionsEntityDataService } from './internals/admin.permissions.entity.data.service';
import { BackendServiceModel } from 'src/app/shared/models/acl.services.model';
import { cloneDeep, merge } from 'lodash';
import { AdminPermissionsEntitiesState } from '../../state/entities/admin.permissions.entities.state';

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
        const service_entities = this.normalizr.normalize([role_entity], this.normalizr.mainSchema) /** normalize role to get the normalized service with new UIDs */

        /** update dirty entities */
        merge(service_entities.entities['services'], this.entity_data_service.dirty_entities)
        merge(service_entities.entities['operations'], this.entity_data_service.dirty_entities)
        merge(service_entities.entities['fields'], this.entity_data_service.dirty_entities)

        const service_uids = Object.keys(service_entities.entities['services'])

        /** Update entities */
        merge(service_entities.entities['fields'], this.entity_data_service.entities.fields)
        merge(service_entities.entities['services'], this.entity_data_service.entities.services)
        merge(service_entities.entities['operation'], this.entity_data_service.entities.operations);
        (this.entity_data_service.entities.roles[role_entity.uid].services as EntityChildren).push(...service_uids) /** add new service to role */
    }

}