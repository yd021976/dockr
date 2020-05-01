import { Schema, schema, denormalize, normalize } from "normalizr";
import { v4 as uuid } from 'uuid';
import { AdminPermissionsRoleEntity, AdminPermissionsServiceEntity, AdminPermissionsOperationEntity, AdminPermissionsFieldEntity, EntityChildren, ENTITY_TYPES } from "../models/admin.permissions.model";
import { cloneDeep } from 'lodash';
import { ALLOWED_STATES } from "src/app/shared/models/acl.service.action.model";
/**
 * 
 */
export class AdminPermissionsNormalizrSchemas {
    static instance: AdminPermissionsNormalizrSchemas = null
    schemaOptions
    // define entities schemas
    fieldSchema: Schema
    fieldsSchema: Schema
    crudOperationsSchema: Schema
    serviceSchema: Schema
    roleSchema: Schema
    mainSchema: Schema

    private generateUUID = (value, parent, key) => {
        /** generate UID for object if not already exists */
        if (!Object.prototype.hasOwnProperty.call(value, 'uid')) value['uid'] = uuid()

        let children: EntityChildren = []
        let entity: AdminPermissionsRoleEntity | AdminPermissionsServiceEntity | AdminPermissionsOperationEntity | AdminPermissionsFieldEntity
        let parent_entities_key: string
        let entity_allowed_prop_value: ALLOWED_STATES = null

        /** Create object of node type */
        switch (key) {
            case 'services':
                entity = new AdminPermissionsServiceEntity()
                entity.entity_type = ENTITY_TYPES.SERVICE
                //WARN Here we change the source property name 'crud_operations' to 'operations'
                children = value['crud_operations'] ? cloneDeep(value['crud_operations']) : []
                entity.operations = children
                entity.children_key = 'operations'
                parent_entities_key = 'roles'
                entity_allowed_prop_value = null /** no allowed property for 'service' entity */
                break
            case 'operations':
                entity = new AdminPermissionsOperationEntity()
                entity.entity_type = ENTITY_TYPES.OPERATION
                children = value['fields'] ? cloneDeep(value['fields']) : []
                entity.fields = children
                entity.children_key = 'fields'
                parent_entities_key = 'services'
                /** set allowed value, ensure for this entity that a value is provided */
                if (value['allowed'] === null || value['allowed'] === undefined)
                    entity_allowed_prop_value = ALLOWED_STATES.FORBIDDEN
                else
                    entity_allowed_prop_value = value['allowed']
                break
            case 'fields':
                entity = new AdminPermissionsFieldEntity()
                children = value['fields'] ? cloneDeep(value['fields']) : []
                entity.fields = children
                entity.entity_type = ENTITY_TYPES.FIELD
                entity.children_key = 'fields'
                switch (parent.constructor.name) {
                    case 'AdminPermissionsFieldEntity':
                        parent_entities_key = 'fields'
                        break
                    case 'AdminPermissionsOperationEntity':
                        parent_entities_key = 'operations'
                        break
                }
                /** set allowed value, ensure for this entity that a value is provided */
                if (value['allowed'] === null || value['allowed'] === undefined)
                    entity_allowed_prop_value = ALLOWED_STATES.FORBIDDEN
                else
                    entity_allowed_prop_value = value['allowed']
                break
            default:
                entity = new AdminPermissionsRoleEntity()
                entity.entity_type = ENTITY_TYPES.ROLE
                children = value['services'] ? cloneDeep(value['services']) : []
                entity.services = children
                entity.children_key = 'services'
                entity_allowed_prop_value = null /** no allowed property for 'service' entity */
                break
        }
        if (entity !== null) {
            entity.entitiesKey = key
            entity.id = value['_id'] ? value['_id'] : value['id']
            entity.name = value['name']
            entity.uid = value['uid']
            entity.allowed = entity_allowed_prop_value
            entity.parentEntity = {
                type: (parent !== null && parent.constructor.name !== 'Array') ? parent.constructor.name : null,
                uid: (parent !== null && parent.constructor.name !== 'Array') ? parent.uid : null,
                entitiesKey: parent_entities_key,
                childrenKey: key
            }
            return entity
        }
        /**WARN this should never appears, if so there is a bug */
        /**TODO Add a log to warn there is something wrong with inout data */
        else {
            console.warn('Normalizr: No entity created', value)
            return { ...value }
        }
    }
    constructor() {
        if (AdminPermissionsNormalizrSchemas.instance) return AdminPermissionsNormalizrSchemas.instance

        this.schemaOptions = { idAttribute: 'uid', processStrategy: this.generateUUID }
        this.fieldSchema = new schema.Entity('fields', {}, this.schemaOptions)
        const fieldsSchema = new schema.Array(this.fieldSchema)
        this.fieldSchema.define({ fields: fieldsSchema })

        this.crudOperationsSchema = new schema.Entity('operations', { 'fields': [this.fieldSchema] }, this.schemaOptions)
        this.serviceSchema = new schema.Entity('services', { 'operations': [this.crudOperationsSchema] }, this.schemaOptions)
        this.roleSchema = new schema.Entity('roles', { 'services': [this.serviceSchema] }, this.schemaOptions)
        this.mainSchema = new schema.Array(this.roleSchema)
        AdminPermissionsNormalizrSchemas.instance = this
    }
    public normalize(data, schema) {
        return normalize(data, schema)
    }
    public denormalize(input, schema, entities) {
        return denormalize(input, schema, entities)
    }
}