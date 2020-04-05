import { State, Action, StateContext, Actions, ofActionDispatched, ofActionSuccessful, ofActionCompleted } from "@ngxs/store";
import { SiteZonesStateModel, SiteZoneEntities } from "../../../../models/site.zones.entities.model";
import { SiteZonesActions } from "../../../actions/site.zones.actions";
import { SiteZonesNormalizr } from "./site.zones.normlizr";
import { SiteZonesUiActions } from "../../../actions/site.zones.ui.actions";
import { state } from "@angular/animations";

export const default_siteZones_state: SiteZonesStateModel = {
    zone_entities: {},
    children_entities: {}
}

@State<SiteZonesStateModel>({
    name: 'site_zones',
    defaults: default_siteZones_state

})
export class SiteZonesState {
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
     *  Load routes (siteZones) data
     */
    @Action(SiteZonesActions.Load_All_Success)
    load_all_success(ctx: StateContext<SiteZonesStateModel>, action: SiteZonesActions.Load_All_Success) {
        try {
            const results = SiteZonesState.normalizr.normalize(action.appRoutes, SiteZonesState.normalizr.mainSchema)
            if (!results.entities || !results.entities.routes || !results.entities.children) {
                throw new Error('State error at normalize data')
            }

            /** Remove entity with "redirect to" property because required roles should be handled by the target route */
            
            /** Update state */
            ctx.setState({
                zone_entities: results.entities.routes,
                children_entities: results.entities.children
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
    add_zone(ctx: StateContext<SiteZonesStateModel>, action: SiteZonesActions.Add_Zone) { }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(SiteZonesActions.Add_Zone_Success)
    add_zone_success(ctx: StateContext<SiteZonesStateModel>, action: SiteZonesActions.Add_Zone_Success) { }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(SiteZonesActions.Add_Zone_Error)
    add_zone_error(ctx: StateContext<SiteZonesStateModel>, action: SiteZonesActions.Add_Zone_Error) { }


    /**
     * 
     */
    @Action(SiteZonesActions.Update_Zone)
    update_zone(ctx: StateContext<SiteZonesStateModel>, action: SiteZonesActions.Update_Zone) {
        ctx.dispatch(new SiteZonesUiActions.LoadStart())
    }

    /**
     * 
     */
    @Action(SiteZonesActions.Update_Zone_Success)
    update_zone_success(ctx: StateContext<SiteZonesStateModel>, action: SiteZonesActions.Update_Zone_Success) {
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
    update_zone_error(ctx: StateContext<SiteZonesStateModel>, action: SiteZonesActions.Update_Zone_Error) {

    }


}