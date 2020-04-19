import { State, Actions, Store, ofActionSuccessful, InitState } from "@ngxs/store";
import { AclStateUIModel } from "src/app/shared/models/acl.entities.model";
import { Action, StateContext, Selector } from "@ngxs/store";
import { AclUIActions } from '../../../actions/acl2/acl2.state.actions'
import { AppError, errorType } from "src/app/shared/models/application.error.model";
import { UIStateAclOperators } from './state.operators'
import { error_actions, error_actions_types, start_actions, start_actions_types, success_actions, success_actions_types } from './state.action.types.list'
import { Injectable } from "@angular/core";
import { take } from "rxjs/operators";


@State<AclStateUIModel>({
    name: 'acl2',
    defaults: {
        isLoading: false,
        isError: false,
        error: '',
        selectedNode: null
    }
})

@Injectable()
export class AclUIState {
    /**
     * 
     */
    constructor() {}

    @Action(start_actions)
    loading_start(ctx: StateContext<AclStateUIModel>, action: start_actions_types) {
        ctx.setState(UIStateAclOperators.loadingStart())
    }

    @Action(success_actions)
    loading_success(ctx: StateContext<AclStateUIModel>, action: success_actions_types) {
        ctx.setState(UIStateAclOperators.loadingSuccess())
    }

    @Action(error_actions)
    loading_error(ctx: StateContext<AclStateUIModel>, action: error_actions_types) {
        ctx.setState(UIStateAclOperators.loadingError(action.error))
    }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action(AclUIActions.Acl_Tree_Node_Select)
    acl_tree_select_node(ctx: StateContext<AclStateUIModel>, action: AclUIActions.Acl_Tree_Node_Select) {
        ctx.patchState(
            {
                selectedNode: action.currentNode
            }
        )
    }

    @Selector([AclUIState])
    static isLoading(state: AclStateUIModel): boolean {
        return state.isLoading
    }
}