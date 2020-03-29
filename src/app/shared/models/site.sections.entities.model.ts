import { BaseUIModel } from "./base.ui.model"
import { siteSectionFlatNode } from "src/app/features-modules/admin/site.sections/services/site.sections.datasource"

/**
 * Selection model
 */
export class SiteSectionSelection {
    treeviewNode: siteSectionFlatNode
}

/**
 * Site section denormalized model
 */
export class SiteSectionModel {
    id: string
    roles: string[]
    children: SiteSectionModel[]
}

/**
 * Array/list of site section denormlized model
 */
export class SiteSectionModels {
    [sectionId: string]: SiteSectionModel
}

/**
 * Site section normalized entity
 */
export class SiteSectionEntity {
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
export class SiteSectionsEntities {
    [siteSectionId: string]: SiteSectionEntity
}

/**
 * Site section state model
 */
export class SiteSectionStateModel {
    section_entities: SiteSectionsEntities
    children_entities: SiteSectionsEntities
}

export class SiteSectionUIStateModel extends BaseUIModel {
    selection: SiteSectionSelection
}