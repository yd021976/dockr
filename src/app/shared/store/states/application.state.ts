import { Action, State, StateContext, Selector, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { ApplicationStateModel } from '../../models/application-state.model';
import { UserState } from '../states/user.state';
import { TemplatesState } from './templates.state';

@State<ApplicationStateModel>({
    name: 'application',
    defaults: {},
    children: [UserState, TemplatesState]
})
export class ApplicationState {
    //
    // Selectors
    //

    /** Flag : is User logged in */
    @Select(UserState.isLoggedin) static isLoggedin$: Observable<boolean>

    /** */
    @Selector()
    static isProgress(state) {
        return state.user.isProgress | state.templates.isLoading;
    }

    @Selector()
    static getCurrentUser(state) {
        return state.user;
    }

    @Selector()
    static authError(state) {
        return state.user.error;
    }
}