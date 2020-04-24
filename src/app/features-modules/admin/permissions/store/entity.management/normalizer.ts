import { Schema, schema, denormalize, normalize } from "normalizr";
import { v4 as uuid } from 'uuid';
import { AdminPermissionsEntityTypes, AdminPermissionsRoleEntity, AdminPermissionsServiceEntity, AdminPermissionsOperationEntity, AdminPermissionsFieldEntity, EntityChildren } from "../models/admin.permissions.model";
import { cloneDeep } from 'lodash';
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

        let children:EntityChildren = []
        let entity: AdminPermissionsRoleEntity | AdminPermissionsServiceEntity | AdminPermissionsOperationEntity | AdminPermissionsFieldEntity

        /** Create object of node type */
        switch (key) {
            case 'services':
                //WARN Here we change the source property name 'crud_operations' to 'operations'
                children = value['crud_operations'] ? cloneDeep(value['crud_operations']) : []
                entity = new AdminPermissionsServiceEntity()
                entity.operations = children
                break
            case 'operations':
                entity = new AdminPermissionsOperationEntity()
                children = value['fields'] ? cloneDeep(value['fields']) : []
                entity.fields = children
                break
            case 'fields':
                entity = new AdminPermissionsFieldEntity()
                children = value['fields'] ? cloneDeep(value['fields']) : []
                entity.fields = children
                break
            default:
                children = value['services'] ? cloneDeep(value['services']) : []
                entity = new AdminPermissionsRoleEntity()
                entity.services = children
                break
        }

        if (entity !== null) {
            entity.id = value['_id'] ? value['_id'] : value['id']
            entity.name = value['name']
            entity.uid = value['uid']
            entity.allowed = value['allowed'] || null
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