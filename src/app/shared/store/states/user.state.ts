import { Action, State, StateContext, Selector } from '@ngxs/store';
import { UserModel } from '../../models/user.model';
import * as actions from '../actions/user.actions';
import { NGXLogger } from 'ngx-logger';

const defaultState: UserModel = {
    nickname: '',
    email: '',
    isLoggedIn: false,
    isAnonymous: false,
    isProgress: false,
    isError: false,
    error: '',
    roles: [],
    settings: []
}

@State<UserModel>({
    name: 'user',
    defaults: defaultState
})
export class UserState {
    constructor(protected logger: NGXLogger) { }
    @Action(actions.UserLoginAction)
    login(ctx: StateContext<UserModel>) {
        ctx.patchState({
            isProgress: true,
            isLoggedIn: false,
            isError: false,
            error: ''
        });
    }

    @Action(actions.UserLoginSuccessAction)
    loginSucess(ctx: StateContext<UserModel>, action: actions.UserLoginSuccessAction) {
        ctx.patchState({
            nickname: action.user['anonymous'] ? 'Anonymous' : action.user['nickname'] ? action.user['nickname'] : action.user['email'],
            email: action.user['anonymous'] ? 'Anonymous' : action.user['email'],
            isAnonymous: action.user['anonymous'] ? true : false,
            isLoggedIn: true,
            isProgress: false,
            isError: action.user['anonymous'] ? ctx.getState().isError : false, // don't update last error if user logged as anonymous
            error: action.user['anonymous'] ? ctx.getState().error : '', // don't update last error if user logged as anonymous
        });
        this.logger.debug('[UserState]', 'loginSucess', ctx.getState());

    }

    @Action(actions.UserLoginErrorAction)
    loginError(ctx: StateContext<UserModel>, action: actions.UserLoginErrorAction) {
        ctx.patchState({
            isProgress: false,
            isError: true,
            error: action.error
        })
        this.logger.debug('[UserState]', 'loginError', ctx.getState());
    }

    @Action(actions.UserLogoutAction)
    logout(ctx: StateContext<UserModel>, action: actions.UserLogoutAction) {
        ctx.patchState({
            isProgress: true
        })
    }
    @Action(actions.UserLogoutSuccessAction)
    logoutSuccess(ctx: StateContext<UserModel>, action: actions.UserLogoutSuccessAction) {
        ctx.setState(defaultState);
    }
    @Action(actions.UserLogoutErrorAction)
    logoutError(ctx: StateContext<UserModel>, action: actions.UserLogoutErrorAction) {
        ctx.patchState({
            isProgress: false,
            isError: true,
            error: action.error
        })
    }

    /**
     * TODO: Implement correct isLoggedin selector
     */
    @Selector()
    static isLoggedin(state: UserModel) {
        if (!state.isAnonymous && state.email != '') return true; else return false;
    }
}