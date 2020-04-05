import * as _ from 'lodash';
import { denormalize, normalize, NormalizedSchema, Schema, schema } from "normalizr";
import { ApplicationRouteInterface } from "src/app/shared/models/application.route.model";
import { SiteZonesNormalizrResultEntities } from "src/app/shared/models/site.zones.entities.model";

/**
 * Return ID of the processed entity
 * 
 * @param value 
 * @param parent 
 * @param key 
 */
function getId(value: ApplicationRouteInterface) {
    return value.data.siteZone
}


/**
 * Pre-processing of "route" entity to "siteZone" entity
 * 
 * @param value 
 * @param parent 
 * @param key 
 */
function entityProcessStrategy(value: ApplicationRouteInterface, parent, key) {
    const entity = {
        id: getId(value), // ID is the siteZone property of route entity
        path: value.path,
        roles: value.data.defaultRoles ? _.cloneDeep(value.data.defaultRoles) : [],
        children: value.children ? _.cloneDeep(value.children) : [],
        title: value.data.title,
        isRedirect: (typeof value.redirectTo == 'undefined' || value.redirectTo == '') ? false : true,
        data: _.cloneDeep(value.data)
    }
    return entity
}


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
        const childrenSchema = new schema.Entity('children', {}, { idAttribute: getId, processStrategy: entityProcessStrategy })
        const children = new schema.Array(childrenSchema)
        childrenSchema.define({ 'children': children })

        // Define zone entity
        const routes = new schema.Entity('routes', { children }, { idAttribute: getId, processStrategy: entityProcessStrategy })
        this.mainSchema = new schema.Array(routes)
        SiteZonesNormalizr.instance = this
    }
    public normalize(data, schema): NormalizedSchema<SiteZonesNormalizrResultEntities, string[]> {
        return normalize(data, schema)
    }
    public denormalize(input, schema, entities) {
        return denormalize(input, schema, entities)
    }
}