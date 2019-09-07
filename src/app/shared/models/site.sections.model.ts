export class SiteSectionSelection {
    sectionId: string
    sectionModel: SiteSectionModel
}

export class SiteSectionModel {
    id: string
    roles: string[]
    children: SiteSectionModel[]
}
export class SiteSectionModels {
    [ sectionId: string ]: SiteSectionModel
}

export class SiteSectionEntity {
    id: string
    roles: string[]
    children: string[]
}
export class SiteSectionsEntities {
    [ siteSectionId: string ]: SiteSectionEntity
}

export class SiteSectionStateModel {
    isLoading: boolean
    isError: boolean
    error: string
    selection: SiteSectionSelection
    section_entities: SiteSectionsEntities
    children_entities: SiteSectionsEntities
}