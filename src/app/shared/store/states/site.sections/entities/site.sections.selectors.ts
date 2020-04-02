import { Selector, createSelector } from "@ngxs/store";
import { SiteZonesStateModel, SiteZoneEntity, SiteZonesUIStateModel } from "../../../../models/site.zones.entities.model";
import { SiteSectionsState } from './site.sections.state'
import { SiteZonesUIState } from "../ui/site.sections.ui.state";
import { SiteZonesUISelectors } from "../ui/site.section.ui.selectors";
import { siteZoneFlatNode } from "src/app/features-modules/admin/site.zones/services/site.zones.datasource";

export class SiteZonesSelectors {
    /**
     * Current selection
     * @param state 
     */
    @Selector([SiteZonesUISelectors.treeview_selected_node, SiteSectionsState])
    public static selected(selected_node: siteZoneFlatNode, state: SiteZonesStateModel) {
        // const entity = state.section_entities[uistate.selection.treeviewNode.item.id] || state.children_entities[uistate.selection.treeviewNode.item.id] || null
        const entity = state.zone_entities[selected_node.item.id] || state.children_entities[selected_node.item.id] || null
        return entity
    }

    @Selector([SiteSectionsState])
    public static root_zones(state: SiteZonesStateModel) {
        return state.zone_entities
    }


    @Selector([SiteSectionsState])
    public static children_zones(state: SiteZonesStateModel) {
        return state.children_entities
    }

    /**
     * Get node's children
     * Return array of site section entity
     * 
     * @param node 
     */
    public static getChildrenEntities(node: SiteZoneEntity) {
        return createSelector([SiteSectionsState], (state: SiteZonesStateModel): SiteZoneEntity[] => {
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