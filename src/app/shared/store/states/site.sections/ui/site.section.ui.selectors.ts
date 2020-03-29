import { Selector } from "@ngxs/store";
import { SiteSectionUIStateModel } from "src/app/shared/models/site.sections.entities.model";
import { SiteSectionUIState } from "./site.sections.ui.state";

export class SiteSectionsUISelectors {
    @Selector([SiteSectionUIState])
    public static selected(state: SiteSectionUIStateModel) {
        return state.selection.treeviewNode
    }
}