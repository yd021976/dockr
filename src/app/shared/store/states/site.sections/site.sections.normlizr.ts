import { Schema, schema, denormalize, normalize } from "normalizr";

export class SiteSectionsNormalizr {
    static instance: SiteSectionsNormalizr = null
    schemaOptions

    // define entities schemas
    mainSchema: Schema

    sectionSchema: Schema
    sectionsSchema: Schema

    childrenShema: Schema

    constructor() {
        if ( SiteSectionsNormalizr.instance ) return SiteSectionsNormalizr.instance
        this.childrenShema = new schema.Entity( 'children', {} )

        this.sectionSchema = new schema.Entity( 'sections', {} )
        this.sectionsSchema = new schema.Array( this.sectionSchema )
        this.sectionSchema.define( { 'children': [ this.childrenShema ] } )
        this.sectionSchema.define( { 'roles': this.sectionsSchema } )

        this.mainSchema = new schema.Array( this.sectionSchema )
        SiteSectionsNormalizr.instance = this
    }
    public normalize( data, schema ) {
        return normalize( data, schema )
    }
    public denormalize( input, schema, entities ) {
        return denormalize( input, schema, entities )
    }
}