import { State, Action, StateContext, Actions, ofActionDispatched, ofActionSuccessful, ofActionCompleted } from "@ngxs/store";
import { SiteSectionStateModel } from "../../../../models/site.sections.entities.model";
import { SiteSectionsActions } from "../../../actions/site.sections.actions";
import { SiteSectionsNormalizr } from "./site.sections.normlizr";
import { SiteSectionsUiActions } from "../../../actions/site.sections.ui.actions";
import { state } from "@angular/animations";

export const default_siteSection_state: SiteSectionStateModel = {
    section_entities: {},
    children_entities: {}
}

@State<SiteSectionStateModel>({
    name: 'site_sections',
    defaults: default_siteSection_state

})
export class SiteSectionsState {
    constructor(private action$: Actions) { }

    static readonly normalizr: SiteSectionsNormalizr = new SiteSectionsNormalizr()

    /**
     * 
     */
    @Action(SiteSectionsActions.Load_All)
    load_all(ctx: StateContext<SiteSectionStateModel>, action: SiteSectionsActions.Load_All) {
        ctx.dispatch(new SiteSectionsUiActions.LoadStart())
    }

    /**
     * 
     */
    @Action(SiteSectionsActions.Load_All_Success)
    load_all_success(ctx: StateContext<SiteSectionStateModel>, action: SiteSectionsActions.Load_All_Success) {
        try {
            const results = SiteSectionsState.normalizr.normalize(action.sections, SiteSectionsState.normalizr.mainSchema)
            if (!results.entities || !results.entities['sections'] || !results.entities['children']) {
                throw new Error('State error at normalize data')
            }
            ctx.setState({
                section_entities: results.entities['sections'],
                children_entities: results.entities['children'],
            })
            return ctx.dispatch(new SiteSectionsUiActions.LoadSuccess())
        }
        catch (err) {
            return ctx.dispatch(new SiteSectionsActions.Load_All_Error(err.message))
        }
    }

    /**
     * 
     */
    @Action(SiteSectionsActions.Load_All_Error)
    load_all_error(ctx: StateContext<SiteSectionStateModel>, action: SiteSectionsActions.Load_All_Error) {
        ctx.patchState({
            section_entities: {},
            children_entities: {},
        })
        return ctx.dispatch(new SiteSectionsUiActions.LoadError(action.error))
    }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(SiteSectionsActions.Add_Section)
    add_section(ctx: StateContext<SiteSectionStateModel>, action: SiteSectionsActions.Add_Section) { }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(SiteSectionsActions.Add_Section_Success)
    add_section_success(ctx: StateContext<SiteSectionStateModel>, action: SiteSectionsActions.Add_Section_Success) { }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(SiteSectionsActions.Add_Section_Error)
    add_section_error(ctx: StateContext<SiteSectionStateModel>, action: SiteSectionsActions.Add_Section_Error) { }


    /**
     * 
     */
    @Action(SiteSectionsActions.Update_Section)
    update_section(ctx: StateContext<SiteSectionStateModel>, action: SiteSectionsActions.Update_Section) {
        ctx.dispatch(new SiteSectionsUiActions.LoadStart())
    }

    /**
     * 
     */
    @Action(SiteSectionsActions.Update_Section_Success)
    update_section_success(ctx: StateContext<SiteSectionStateModel>, action: SiteSectionsActions.Update_Section_Success) {
        const state = ctx.getState().children_entities

        ctx.patchState({
            children_entities: {
                ...state, [action.sectionEntity.id]: action.sectionEntity
            }
        })

        //TODO: For debug tests only, to remove
        const stateAfterUpdate = ctx.getState()
    }

    /**
     * 
     */
    @Action(SiteSectionsActions.Update_Section_Error)
    update_section_error(ctx: StateContext<SiteSectionStateModel>, action: SiteSectionsActions.Update_Section_Error) {

    }


}