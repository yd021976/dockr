import { State, Action, StateContext, Selector } from "@ngxs/store";
import { AdminPermissionsStateUIModel } from "../../models/admin.permissions.model";
import { Injectable } from "@angular/core";
import { AdminPermissionsUIActions } from "../../actions/admin.permissions.ui.actions";


@State<AdminPermissionsStateUIModel>({
    name: 'AdminPermissionsUI',
    defaults: {
        selected: null
    }
})
@Injectable()
export class AdminPermissionsUIState {
    @Action(AdminPermissionsUIActions.SelectTreeviewNode)
    public static admin_permissions_ui_select_treeview_node(ctx: StateContext<AdminPermissionsStateUIModel>, action: AdminPermissionsUIActions.SelectTreeviewNode) {
        /** handle de-selection of node (i.e When action 'node' is the same that is already selected in state) */
        const current_selection = ctx.getState().selected
        const selection = current_selection === action.node ? null : action.node

        /** update state with selection */
        ctx.patchState({
            selected: selection
        })
    }

    @Selector()
    public static selected(state: AdminPermissionsStateUIModel) {
        return state.selected
    }
}