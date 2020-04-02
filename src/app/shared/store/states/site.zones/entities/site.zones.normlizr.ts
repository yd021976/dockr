import { Schema, schema, denormalize, normalize } from "normalizr";

export class SiteZonesNormalizr {
    static instance: SiteZonesNormalizr = null
    schemaOptions

    // define entities schemas
    mainSchema: Schema
    zoneSchema: Schema
    childrenSchema: Schema

    constructor() {
        if (SiteZonesNormalizr.instance) return SiteZonesNormalizr.instance

        // Define children entity
        const childrenSchema = new schema.Entity('children')
        const children = new schema.Array(childrenSchema)
        childrenSchema.define({ 'children': children })

        // Define zone entity
        const zone = new schema.Entity('zones', {children})
        this.mainSchema = new schema.Array(zone)
        SiteZonesNormalizr.instance = this
    }
    public normalize(data, schema) {
        return normalize(data, schema)
    }
    public denormalize(input, schema, entities) {
        return denormalize(input, schema, entities)
    }
}