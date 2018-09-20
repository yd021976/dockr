import { Action, State, StateContext, Selector, Select } from '@ngxs/store';

import * as user_actions from '../actions/user.actions';
import { ApplicationStateModel } from '../../models/application-state.model';
import { UserState } from '../states/user.state';
import { Observable } from 'rxjs';

@State<ApplicationStateModel>({
    name: 'application',
    defaults: { isLoggedIn: false, isRequestingBackend: false },
    children: [UserState]
})
export class ApplicationState {
    //
    // Selectors
    //
    
    /** Flag : is User logged in */
    @Select(UserState.isLoggedin) static isLoggedin: Observable<boolean>


    //
    // Actions
    //
    @Action([user_actions.UserLoginAction, user_actions.UserLogoutAction])
    apiRequestingStart(ctx: StateContext<ApplicationStateModel>) {
        ctx.patchState({ isRequestingBackend: true });
    }

    @Action([
        user_actions.UserLoginErrorAction,
        user_actions.UserLoginSuccessAction,
        user_actions.UserLogoutSuccessAction,
        user_actions.UserLogoutErrorAction
    ])
    apiRequestingEnd(ctx: StateContext<ApplicationStateModel>) {
        ctx.patchState({ isRequestingBackend: false });
    }


    //
    @Selector()
    static isNetworkProgress(state: ApplicationStateModel) {
        return state.isRequestingBackend;
    }
}