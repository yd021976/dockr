import { Action, State, StateContext, Selector, Select } from '@ngxs/store';

import * as user_actions from '../actions/user.actions';
import { ApplicationStateModel } from '../../models/application-state.model';
import { UserState } from '../states/user.state';
import { Observable } from 'rxjs';

@State<ApplicationStateModel>({
    name: 'application',
    defaults: {},
    children: [UserState]
})
export class ApplicationState {
    //
    // Selectors
    //

    /** Flag : is User logged in */
    @Select(UserState.isLoggedin) static isLoggedin: Observable<boolean>

    /** */
    @Selector()
    static isProgress(state) {
        return state.user.isProgress;
    }

    @Selector()
    static getUser(state) {
        return state.user;
    }

    @Selector()
    static authError(state) {
        return state.user.error;
    }
}