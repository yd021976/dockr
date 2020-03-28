import { Selector, createSelector } from "@ngxs/store";
import { SiteSectionStateModel, SiteSectionEntity, SiteSectionsEntities } from "../../../../models/site.sections.entities.model";
import { SiteSectionsState } from './site.sections.state'

export class SiteSectionsSelectors {
    /**
     * Current selection
     * @param state 
     */
    @Selector([SiteSectionsState])
    public static selected(state: SiteSectionStateModel) {
        // return state.selection
    }

    @Selector([SiteSectionsState])
    public static root_sections(state: SiteSectionStateModel) {
        return state.section_entities
    }


    @Selector([SiteSectionsState])
    public static children_sections(state: SiteSectionStateModel) {
        return state.children_entities
    }


    /**
     * Get node's children
     * Return array of site section entity
     * 
     * @param node 
     */
    public static getChildrenEntities(node: SiteSectionEntity) {
        return createSelector([SiteSectionsState], (state: SiteSectionStateModel): SiteSectionEntity[] => {
            let children = Object.keys(state.children_entities)
                .filter((childrenKey) => {
                    return node.children.find(((value) => {
                        return childrenKey == value
                    }))
                })
                .map((key) => {
                    return state.children_entities[key]
                })
            return children
        })
    }

}