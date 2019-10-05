import { Selector } from "@ngxs/store";
import { SiteSectionStateModel } from "../../../../models/site.sections.entities.model";
import { SiteSectionsState } from './site.sections.state'

export class SiteSectionsSelectors {
    /**
     * Current selection
     * @param state 
     */
    @Selector( [ SiteSectionsState ] )
    public static selected( state: SiteSectionStateModel ) {
        // return state.selection
    }
}