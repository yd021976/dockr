import { Schema, schema, denormalize, normalize } from "normalizr";

export class SiteSectionsNormalizr {
    static instance: SiteSectionsNormalizr = null
    schemaOptions

    // define entities schemas
    mainSchema: Schema
    sectionSchema: Schema
    childrenSchema: Schema

    constructor() {
        if (SiteSectionsNormalizr.instance) return SiteSectionsNormalizr.instance

        // Define children entity
        const childrenSchema = new schema.Entity('children')
        const children = new schema.Array(childrenSchema)
        childrenSchema.define({ 'children': children })

        // Define Section entity
        const section = new schema.Entity('sections', {children})
        this.mainSchema = new schema.Array(section)
        SiteSectionsNormalizr.instance = this
    }
    public normalize(data, schema) {
        return normalize(data, schema)
    }
    public denormalize(input, schema, entities) {
        return denormalize(input, schema, entities)
    }
}