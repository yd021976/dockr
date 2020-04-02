import { Selector, createSelector } from "@ngxs/store";
import { SiteZonesStateModel, SiteZoneEntity } from "../../../../models/site.zones.entities.model";
import { SiteZonesState } from './site.zones.state'
import { SiteZonesUISelectors } from "../ui/site.zones.ui.selectors";
import { siteZoneFlatNode } from "src/app/features-modules/admin/site.zones/services/site.zones.datasource";

export class SiteZonesSelectors {
    /**
     * Current selection
     * @param state 
     */
    @Selector([SiteZonesUISelectors.treeview_selected_node, SiteZonesState])
    public static selected(selected_node: siteZoneFlatNode, state: SiteZonesStateModel) {
        const entity = state.section_entities[selected_node.item.id] || state.children_entities[selected_node.item.id] || null
        return entity
    }

    @Selector([SiteZonesState])
    public static root_zones(state: SiteZonesStateModel) {
        return state.section_entities
    }


    @Selector([SiteZonesState])
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
        return createSelector([SiteZonesState], (state: SiteZonesStateModel): SiteZoneEntity[] => {
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