import { State, Action, StateContext } from '@ngxs/store'
import { SiteZonesUIStateModel } from 'src/app/shared/models/site.zones.entities.model';
import { SiteZonesUiOperators } from './site.zones.ui.operators';
import { SiteZonesUiActions } from '../../../actions/site.zones.ui.actions';

const default_state: SiteZonesUIStateModel = {
    isLoading: false,
    isError: false,
    error: '', // Will log only latest error
    selection: {
        treeviewNode: null,
        role: {}
    }
}

@State<SiteZonesUIStateModel>({
    name: 'site_zones_ui',
    defaults: default_state
})
export class SiteZonesUIState {
    private running_actions_count: number = 0

    @Action(SiteZonesUiActions.LoadStart)
    load_start(ctx: StateContext<SiteZonesUIStateModel>, action: SiteZonesUiActions.LoadStart) {
        this.running_actions_count++
        ctx.setState(SiteZonesUiOperators.startLoading())
    }

    @Action(SiteZonesUiActions.LoadSuccess)
    load_success(ctx: StateContext<SiteZonesUIStateModel>, action: SiteZonesUiActions.LoadSuccess) {
        this.running_actions_count > 0 ? this.running_actions_count-- : 0
        if (this.running_actions_count == 0) ctx.setState(SiteZonesUiOperators.loadingSuccess())
    }
    @Action(SiteZonesUiActions.LoadError)
    load_error(ctx: StateContext<SiteZonesUIStateModel>, action: SiteZonesUiActions.LoadError) {
        this.running_actions_count > 0 ? this.running_actions_count-- : 0
        if (this.running_actions_count == 0) ctx.setState(SiteZonesUiOperators.loadingError(action.error))
    }

    @Action(SiteZonesUiActions.SelectTreeviewNode)
    select_treeview_node(ctx: StateContext<SiteZonesUIStateModel>, action: SiteZonesUiActions.SelectTreeviewNode) {
        const state: SiteZonesUIStateModel = ctx.getState()
        ctx.patchState({
            selection: {
                treeviewNode: action.node,
                role: {} /** unset roles list selected roles */
            }
        })
    }

    @Action(SiteZonesUiActions.SelectRole)
    select_role(ctx: StateContext<SiteZonesUIStateModel>, action: SiteZonesUiActions.SelectRole) {
        const state: SiteZonesUIStateModel = ctx.getState()
        ctx.patchState({
            selection: {
                treeviewNode: state.selection.treeviewNode,
                role: {
                    ...state.selection.role, [action.component_name]: action.role
                }
            }
        })
    }

}