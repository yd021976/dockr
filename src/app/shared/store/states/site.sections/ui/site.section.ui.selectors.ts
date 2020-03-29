import { Selector } from "@ngxs/store";
import { SiteSectionUIStateModel } from "src/app/shared/models/site.sections.entities.model";
import { SiteSectionUIState } from "./site.sections.ui.state";

export class SiteSectionsUISelectors {
    @Selector([SiteSectionUIState])
    public static treeview_selected_node(state: SiteSectionUIStateModel) {
        return state.selection.treeviewNode
    }

    @Selector([SiteSectionUIState])
    public static role_list_selected_role(state: SiteSectionUIStateModel) {
        return (component_name: string) => {
            return state.selection.role[component_name]
        }
    }
}