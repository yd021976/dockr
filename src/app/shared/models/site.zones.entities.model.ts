import { BaseUIModel } from "./base.ui.model"
import { siteZoneFlatNode } from "src/app/features-modules/admin/site.zones/services/site.zones.datasource"

/**
 * Selection model for UI
 */
export class SiteZonesSelection {
    treeviewNode: siteZoneFlatNode // The treeview selected node
    role: RoleSelection // The component(s) selected role
}

export class RoleSelection {
    [component_name: string]: string
}
/**
 * Site zone denormalized model
 */
export class SiteZoneModel {
    id: string
    roles: siteZoneRoles
    children: SiteZoneModel[]
}

/**
 * Array/list of site zone denormlized model
 */
export class SiteZonesModel {
    [siteZoneId: string]: SiteZoneModel
}

/**
 * Site zone normalized entity
 */
export class SiteZoneEntity {
    id: string
    path?: string
    isRedirect : boolean // Is this zone entity come from a route defined with "redirectTo"
    title: string
    roles: siteZoneRoles
    children: string[]

    constructor(id: string, description: string, roles: siteZoneRoles = [], children: Array<string> = []) {
        this.id = id
        this.title = description
        this.roles = roles
        this.children = children
    }
}

/**
 * Array/list of Site zone normalized entity
 */
export class SiteZoneEntities {
    [siteZoneId: string]: SiteZoneEntity
}

/**
 * Site zone state model
 */
export class SiteZonesStateModel {
    zone_entities: SiteZoneEntities
    children_entities: SiteZoneEntities
}

export class SiteZonesUIStateModel extends BaseUIModel {
    selection: SiteZonesSelection
}

export type SiteZonesNormalizrResultEntities = {
    'routes': SiteZoneEntities,
    'children': SiteZoneEntities
}

export type siteZoneRoles = string[]

export type siteZonesServiceInterface = {
    [siteZoneId:string]:string[] /** array of roles for each site zone ID */
}