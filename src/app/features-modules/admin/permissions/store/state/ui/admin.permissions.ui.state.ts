import { State, Action, StateContext, Selector, StateOperator } from "@ngxs/store";
import { AdminPermissionsStateUIModel } from "../../models/admin.permissions.model";
import { Injectable } from "@angular/core";
import { AdminPermissionsUIActions } from "../../actions/admin.permissions.ui.actions";
import { StateUtils } from "src/app/shared/store/states/utils";
import { patch } from "@ngxs/store/operators";


@State<AdminPermissionsStateUIModel>({
    name: 'AdminPermissionsUI',
    defaults: {
        isLoading: false,
        isError: false,
        error: '',
        selected: null
    }
})
@Injectable()
export class AdminPermissionsUIState {
    /**
     *                       Actions
     */

    /** Select a treeview node */
    @Action(AdminPermissionsUIActions.SelectTreeviewNode)
    public admin_permissions_ui_select_treeview_node(ctx: StateContext<AdminPermissionsStateUIModel>, action: AdminPermissionsUIActions.SelectTreeviewNode) {
        /** handle de-selection of node (i.e When action 'node' is the same that is already selected in state) */
        const current_selection = ctx.getState().selected
        const selection = current_selection === action.node ? null : action.node

        /** update state with selection */
        ctx.patchState({
            selected: selection
        })
    }

    /**TODO Add loading/error action handlers */


    /**
     *                      selectors 
     */

    /** Selected treeview node */
    @Selector()
    public static selected(state: AdminPermissionsStateUIModel) {
        return state.selected
    }
}




/**
 *                      State operators
 */
export function startLoading(): StateOperator<AdminPermissionsStateUIModel> {
    return patch<AdminPermissionsStateUIModel>(StateUtils.setLoadingStart())
}
export function loadingSuccess(): StateOperator<AdminPermissionsStateUIModel> {
    return patch<AdminPermissionsStateUIModel>(StateUtils.setLoadingSuccess())
}
export function loadingError(error: string): StateOperator<AdminPermissionsStateUIModel> {
    return patch<AdminPermissionsStateUIModel>(StateUtils.setLoadingError(error))
}