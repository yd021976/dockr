import { Schema, schema, denormalize, normalize } from "normalizr";
import { v4 as uuid } from 'uuid';

/**
 * 
 */
export class NormalizrSchemas {
    static instance: NormalizrSchemas = null
    schemaOptions
    // define entities schemas
    chilrenSchema: Schema
    childrenArraySchema: Schema
    fieldSchema: Schema
    fieldsSchema: Schema
    crudOperationsSchema: Schema
    serviceSchema: Schema
    roleSchema: Schema
    mainSchema: Schema

    private generateUUID = ( value ) => {
        if ( !Object.prototype.hasOwnProperty.call( value, 'uid' ) ) value[ 'uid' ] = uuid()
        return { ...value }
    }
    constructor() {
        if ( NormalizrSchemas.instance ) return NormalizrSchemas.instance

        this.schemaOptions = { idAttribute: 'uid', processStrategy: this.generateUUID }
        // define entities schemas
        this.chilrenSchema = new schema.Entity( 'children', {}, this.schemaOptions )
        this.childrenArraySchema = new schema.Array( this.chilrenSchema )
        this.chilrenSchema.define( { 'children': this.childrenArraySchema } )

        this.fieldSchema = new schema.Entity( 'fields', { 'children': [ this.chilrenSchema ] }, this.schemaOptions )
        var fieldsSchema = new schema.Array( this.fieldSchema )
        this.fieldSchema.define( { fieldsSchema } )

        this.crudOperationsSchema = new schema.Entity( 'crud_operations', { 'fields': [ this.fieldSchema ] }, this.schemaOptions )
        // this.crudOperationsSchema = new schema.Entity( 'crud_operations', {}, this.schemaOptions )
        this.serviceSchema = new schema.Entity( 'services', { 'crud_operations': [ this.crudOperationsSchema ] }, this.schemaOptions )
        this.roleSchema = new schema.Entity( 'roles', { 'services': [ this.serviceSchema ] }, this.schemaOptions )
        this.mainSchema = new schema.Array( this.roleSchema )
        NormalizrSchemas.instance = this
    }
    public normalize( data, schema ) {
        return normalize( data, schema )
    }
    public denormalize( input, schema, entities ) {
        return denormalize( input, schema, entities )
    }
}