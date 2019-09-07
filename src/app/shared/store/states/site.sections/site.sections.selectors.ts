import { Selector } from "@ngxs/store";
import { SiteSectionStateModel } from "../../../models/site.sections.model";


export class SiteSectionsSelectors {
    @Selector()
    static selected(state:SiteSectionStateModel) { }
}