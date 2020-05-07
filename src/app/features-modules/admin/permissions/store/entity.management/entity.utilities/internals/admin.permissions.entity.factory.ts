import {
    AdminPermissionsEntityRawData,
    ENTITY_TYPES,
    AdminPermissionsEntityTypes,
    AdminPermissionParentEntityMeta,
    AdminPermissionChildrenEntityMeta,
    ALLOWED_STATES,
    AdminPermissionsRoleEntity,
    AdminPermissionsServiceEntity,
    AdminPermissionsOperationEntity,
    AdminPermissionsFieldEntity
} from "../../../models/admin.permissions.model"
import { cloneDeep } from 'lodash';
import { v4 as uuid } from 'uuid';
import { } from 'normalizr'

/**
 * Factory to create entities, also used for normalize data
 * 
 * @param rawdata 
 * @param parent 
 * @param type 
 */
export function factory(rawdata: AdminPermissionsEntityRawData, parent: AdminPermissionsEntityRawData = null, type: ENTITY_TYPES = null): AdminPermissionsEntityTypes {
    let parent_meta: AdminPermissionParentEntityMeta = null
    let children_meta: AdminPermissionChildrenEntityMeta = null
    let entity: AdminPermissionsEntityTypes = null

    /** special case : 'this' refers to EntitySchema when called from normalizer. Use it to define entity type creation */
    if (this !== undefined && this.constructor.name === 'EntitySchema') {
        if (type === null) type = this.key
    }
    /** function to compute entity parent UID */
    const parent_uid = (parent) => {
        return (parent !== null && parent.constructor.name !== 'Array') ? parent.uid : null
    }

    /** get entity UUID or generate new one if none */
    const compute_uuid = (entity_raw_data: AdminPermissionsEntityRawData) => {
        return rawdata.uid ? rawdata.uid : uuid()
    }
    /** Rule to get allowed property */
    const compute_allowed = (entity_raw_data: AdminPermissionsEntityRawData, entity_type: ENTITY_TYPES = null) => {
        let allowed: ALLOWED_STATES
        switch (entity_type) {
            case null:
            case ENTITY_TYPES.ROLE:
            case ENTITY_TYPES.SERVICE:
                allowed = null
                break
            default:
                allowed = entity_raw_data.allowed ? entity_raw_data.allowed : ALLOWED_STATES.FORBIDDEN
                break
        }
        return allowed
    }
    const compute_id = (entity_raw_data: AdminPermissionsEntityRawData) => {
        let id: string = null
        if (entity_raw_data['_id']) id = entity_raw_data['_id']
        if (entity_raw_data['id']) id = entity_raw_data['id']
        if (id === null) id = entity_raw_data['name']
        return id
    }

    switch (type) {
        case ENTITY_TYPES.ROLE:
        case null:
            entity = new AdminPermissionsRoleEntity()
            entity.entity_type = ENTITY_TYPES.ROLE
            entity.services = rawdata['services'] ? cloneDeep(rawdata['services']) : []
            entity.allowed = compute_allowed(rawdata, entity.entity_type)
            /** Parent meta data */
            parent_meta = null
            /** children meta data  */
            children_meta = { entity_prop_key: 'services', storage_key: 'services' }
            break
        case ENTITY_TYPES.SERVICE:
            entity = new AdminPermissionsServiceEntity()
            entity.entity_type = ENTITY_TYPES.SERVICE
            entity.operations = rawdata['operations'] ? cloneDeep(rawdata['operations']) : []
            /**FIXME Change backend property name of service children and remove this patch */
            if (entity.operations.length === 0) entity.operations = rawdata['crud_operations'] ? cloneDeep(rawdata['crud_operations']) : []

            entity.allowed = compute_allowed(rawdata, entity.entity_type)
            /** Parent meta data */
            parent_meta = { type: parent.entity_type, storage_key: parent.entity_type, children_key: 'services', uid: parent_uid(parent) }
            /** children meta data  */
            children_meta = { entity_prop_key: ENTITY_TYPES.OPERATION, storage_key: ENTITY_TYPES.OPERATION }
            break
        case ENTITY_TYPES.OPERATION:
            entity = new AdminPermissionsOperationEntity()
            entity.entity_type = ENTITY_TYPES.OPERATION
            entity.fields = rawdata['fields'] ? cloneDeep(rawdata['fields']) : []
            entity.allowed = compute_allowed(rawdata, entity.entity_type)
            /** Parent meta data */
            parent_meta = { type: parent.entity_type, storage_key: parent.entity_type, children_key: ENTITY_TYPES.OPERATION, uid: parent_uid(parent) }
            /** children meta data  */
            children_meta = { entity_prop_key: ENTITY_TYPES.FIELD, storage_key: ENTITY_TYPES.FIELD }
            break
        case ENTITY_TYPES.FIELD:
            entity = new AdminPermissionsFieldEntity()
            entity.entity_type = ENTITY_TYPES.FIELD
            entity.fields = rawdata['fields'] ? cloneDeep(rawdata['fields']) : []
            entity.allowed = compute_allowed(rawdata, entity.entity_type)

            /** Parent meta data */
            parent_meta = { type: parent.entity_type, storage_key: parent.entity_type, children_key: ENTITY_TYPES.FIELD, uid: parent_uid(parent) }
            /** children meta data  */
            children_meta = { entity_prop_key: ENTITY_TYPES.FIELD, storage_key: ENTITY_TYPES.FIELD }
            break
        default:
            break
    }

    /**
     * 
     */
    if (entity) {
        entity.uid = compute_uuid(rawdata)
        entity.id = compute_id(rawdata)
        entity.name = rawdata['name']
        entity.parent_entity_meta = parent_meta
        entity.children_entities_meta = children_meta
        entity.storage_key = type === null ? ENTITY_TYPES.ROLE : type
        return entity
    } else {
        const err = new Error('Factory can not create entity if entity type is null')
        throw err
    }
}