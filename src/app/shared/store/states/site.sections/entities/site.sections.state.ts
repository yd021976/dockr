import { State, Action, StateContext, Actions } from "@ngxs/store";
import { SiteZonesStateModel } from "../../../../models/site.zones.entities.model";
import { SiteZonesActions } from "../../../actions/site.zones.actions";
import { SiteZonesUiActions } from "../../../actions/site.zones.ui.actions";
import { SiteZonesNormalizr } from "../../site.zones/entities/site.zones.normlizr";

export const default_siteSection_state: SiteZonesStateModel = {
    zone_entities: {},
    children_entities: {}
}

@State<SiteZonesStateModel>({
    name: 'site_sections',
    defaults: default_siteSection_state

})
export class SiteSectionsState {
    constructor(private action$: Actions) { }

    static readonly normalizr: SiteZonesNormalizr = new SiteZonesNormalizr()

    /**
     * 
     */
    @Action(SiteZonesActions.Load_All)
    load_all(ctx: StateContext<SiteZonesStateModel>, action: SiteZonesActions.Load_All) {
        ctx.dispatch(new SiteZonesUiActions.LoadStart())
    }

    /**
     * 
     */
    @Action(SiteZonesActions.Load_All_Success)
    load_all_success(ctx: StateContext<SiteZonesStateModel>, action: SiteZonesActions.Load_All_Success) {
        try {
            const results = SiteSectionsState.normalizr.normalize(action.zones, SiteSectionsState.normalizr.mainSchema)
            if (!results.entities || !results.entities['sections'] || !results.entities['children']) {
                throw new Error('State error at normalize data')
            }
            ctx.setState({
                zone_entities: results.entities['sections'],
                children_entities: results.entities['children'],
            })
            return ctx.dispatch(new SiteZonesUiActions.LoadSuccess())
        }
        catch (err) {
            return ctx.dispatch(new SiteZonesActions.Load_All_Error(err.message))
        }
    }

    /**
     * 
     */
    @Action(SiteZonesActions.Load_All_Error)
    load_all_error(ctx: StateContext<SiteZonesStateModel>, action: SiteZonesActions.Load_All_Error) {
        ctx.patchState({
            zone_entities: {},
            children_entities: {},
        })
        return ctx.dispatch(new SiteZonesUiActions.LoadError(action.error))
    }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(SiteZonesActions.Add_Zone)
    add_section(ctx: StateContext<SiteZonesStateModel>, action: SiteZonesActions.Add_Zone) { }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(SiteZonesActions.Add_Zone_Success)
    add_section_success(ctx: StateContext<SiteZonesStateModel>, action: SiteZonesActions.Add_Zone_Success) { }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(SiteZonesActions.Add_Zone_Error)
    add_section_error(ctx: StateContext<SiteZonesStateModel>, action: SiteZonesActions.Add_Zone_Error) { }


    /**
     * 
     */
    @Action(SiteZonesActions.Update_Zone)
    update_section(ctx: StateContext<SiteZonesStateModel>, action: SiteZonesActions.Update_Zone) {
        ctx.dispatch(new SiteZonesUiActions.LoadStart())
    }

    /**
     * 
     */
    @Action(SiteZonesActions.Update_Zone_Success)
    update_section_success(ctx: StateContext<SiteZonesStateModel>, action: SiteZonesActions.Update_Zone_Success) {
        const state = ctx.getState().children_entities

        ctx.patchState({
            children_entities: {
                ...state, [action.zoneEntity.id]: action.zoneEntity
            }
        })

        //TODO: For debug tests only, to remove
        const stateAfterUpdate = ctx.getState()
    }

    /**
     * 
     */
    @Action(SiteZonesActions.Update_Zone_Error)
    update_section_error(ctx: StateContext<SiteZonesStateModel>, action: SiteZonesActions.Update_Zone_Error) {

    }


}