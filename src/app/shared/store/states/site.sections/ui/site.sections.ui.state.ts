import { State, Action, StateContext } from '@ngxs/store'
import { SiteSectionUIStateModel } from 'src/app/shared/models/site.sections.entities.model';
import { SiteSectionsUiOperators } from './site.section.ui.operators';
import { SiteSectionsUiActions } from '../../../actions/site.sections.ui.actions';

const default_state: SiteSectionUIStateModel = {
    isLoading: false,
    isError: false,
    error: '', // Will log only latest error
    selection: {
        treeviewNode: null,
        role: {}
    }
}

@State<SiteSectionUIStateModel>({
    name: 'site_sections_ui',
    defaults: default_state
})
export class SiteSectionUIState {
    private running_actions_count: number = 0

    @Action(SiteSectionsUiActions.LoadStart)
    load_start(ctx: StateContext<SiteSectionUIStateModel>, action: SiteSectionsUiActions.LoadStart) {
        this.running_actions_count++
        ctx.setState(SiteSectionsUiOperators.startLoading())
    }

    @Action(SiteSectionsUiActions.LoadSuccess)
    load_success(ctx: StateContext<SiteSectionUIStateModel>, action: SiteSectionsUiActions.LoadSuccess) {
        this.running_actions_count > 0 ? this.running_actions_count-- : 0
        if (this.running_actions_count == 0) ctx.setState(SiteSectionsUiOperators.loadingSuccess())
    }
    @Action(SiteSectionsUiActions.LoadError)
    load_error(ctx: StateContext<SiteSectionUIStateModel>, action: SiteSectionsUiActions.LoadError) {
        this.running_actions_count > 0 ? this.running_actions_count-- : 0
        if (this.running_actions_count == 0) ctx.setState(SiteSectionsUiOperators.loadingError(action.error))
    }

    @Action(SiteSectionsUiActions.SelectTreeviewNode)
    select_treeview_node(ctx: StateContext<SiteSectionUIStateModel>, action: SiteSectionsUiActions.SelectTreeviewNode) {
        const state: SiteSectionUIStateModel = ctx.getState()
        ctx.patchState({
            selection: {
                treeviewNode: action.node,
                role: {} /** unset roles list selected roles */
            }
        })
    }

    @Action(SiteSectionsUiActions.SelectRole)
    select_role(ctx: StateContext<SiteSectionUIStateModel>, action: SiteSectionsUiActions.SelectRole) {
        const state: SiteSectionUIStateModel = ctx.getState()
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