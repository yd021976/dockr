import { Selector } from "@ngxs/store";
import { SiteZonesUIStateModel } from "src/app/shared/models/site.zones.entities.model";
import { SiteZonesUIState } from "./site.zones.ui.state";

export class SiteZonesUISelectors {
    @Selector([SiteZonesUIState])
    public static treeview_selected_node(state: SiteZonesUIStateModel) {
        return state.selection.treeviewNode
    }

    @Selector([SiteZonesUIState])
    public static role_list_selected_role(state: SiteZonesUIStateModel) {
        return (component_name: string) => {
            return state.selection.role[component_name]
        }
    }
}