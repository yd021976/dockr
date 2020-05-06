import { Schema, schema, denormalize, normalize } from "normalizr";
import { factory } from "./admin.permissions.entity.factory";
import { v4 as uuid } from 'uuid';
/**
 * 
 */
export class AdminPermissionsNormalizrSchemas {
    /**WARN Sinleton is not currently used for this class */
    static instance: AdminPermissionsNormalizrSchemas = null

    schemaOptions
    // define entities schemas
    fieldSchema: Schema
    fieldsSchema: Schema
    crudOperationsSchema: Schema
    serviceSchema: Schema
    roleSchema: Schema
    public mainSchema: Schema

    protected getId = (value, parent, key) => {
        /** if no uuid exists, generate one and change the input value parameter */
        if (!value['uid']) {
            value['uid'] = uuid()
        }
        return value['uid']
    }
    /**
     * 
     */
    constructor() {
        /** NO SINGLETON */
        // if (AdminPermissionsNormalizrSchemas.instance) return AdminPermissionsNormalizrSchemas.instance

        this.schemaOptions = { idAttribute: this.getId, processStrategy: factory }
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