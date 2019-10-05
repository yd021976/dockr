import { BaseUIModel } from "./base.ui.model"

/**
 * Selection model
 */
export class SiteSectionSelection {
    sectionId: string
    sectionModel: SiteSectionModel
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
    [ sectionId: string ]: SiteSectionModel
}

/**
 * Site section normalized entity
 */
export class SiteSectionEntity {
    id: string
    roles: string[]
    children: string[]
}

/**
 * Array/list of Site section normalized entity
 */
export class SiteSectionsEntities {
    [ siteSectionId: string ]: SiteSectionEntity
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