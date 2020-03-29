import { Selector, createSelector } from "@ngxs/store";
import { SiteSectionStateModel, SiteSectionEntity, SiteSectionUIStateModel } from "../../../../models/site.sections.entities.model";
import { SiteSectionsState } from './site.sections.state'
import { SiteSectionUIState } from "../ui/site.sections.ui.state";
import { SiteSectionsUISelectors } from "../ui/site.section.ui.selectors";
import { siteSectionFlatNode } from "src/app/features-modules/admin/site.sections/services/site.sections.datasource";

export class SiteSectionsSelectors {
    /**
     * Current selection
     * @param state 
     */
    @Selector([SiteSectionsUISelectors.treeview_selected_node, SiteSectionsState])
    public static selected(selected_node: siteSectionFlatNode, state: SiteSectionStateModel) {
        // const entity = state.section_entities[uistate.selection.treeviewNode.item.id] || state.children_entities[uistate.selection.treeviewNode.item.id] || null
        const entity = state.section_entities[selected_node.item.id] || state.children_entities[selected_node.item.id] || null
        return entity
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