import { BaseUIModel } from "./base.ui.model"
import { siteZoneFlatNode } from "src/app/features-modules/admin/site.zones/services/site.sections.datasource"

/**
 * Selection model for UI
 */
export class SiteZonesSelection {
    treeviewNode: siteZoneFlatNode
    role: RoleSelection
}

export class RoleSelection {
    [component_name: string]: string
}
/**
 * Site section denormalized model
 */
export class SiteZoneModel {
    id: string
    roles: string[]
    children: SiteZoneModel[]
}

/**
 * Array/list of site section denormlized model
 */
export class SiteZonesModel {
    [sectionId: string]: SiteZoneModel
}

/**
 * Site section normalized entity
 */
export class SiteZoneEntity {
    id: string
    description: string
    roles: string[]
    children: string[]

    constructor(id: string, description: string, roles: Array<string> = [], children: Array<string> = []) {
        this.id = id
        this.description = description
        this.roles = roles
        this.children = children
    }
}

/**
 * Array/list of Site section normalized entity
 */
export class SiteZoneEntities {
    [siteSectionId: string]: SiteZoneEntity
}

/**
 * Site section state model
 */
export class SiteZonesStateModel {
    section_entities: SiteZoneEntities
    children_entities: SiteZoneEntities
}

export class SiteZonesUIStateModel extends BaseUIModel {
    selection: SiteZonesSelection
}