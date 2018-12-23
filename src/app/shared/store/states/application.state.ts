import { Action, State, StateContext, Selector, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { ApplicationStateModel } from '../../models/application-state.model';
import { UserState } from '../states/user.state';
import { TemplatesState } from './templates.state';
import { UserModel } from '../../models/user.model';
import { stat } from 'fs';

@State<ApplicationStateModel>({
    name: 'application',
    children: [UserState, TemplatesState]
})
export class ApplicationState {
    //
    // Selectors
    //

    /** Flag : is User logged in */
    @Selector()
    static isLoggedin(state) {
        return state.user.isLoggedIn
    }

    /** */
    @Selector()
    static isProgress(state): boolean {
        return (state.user.isProgress as boolean) || (state.templates.isLoading as boolean)
    }

    @Selector()
    static getCurrentUser(state) {
        return state.user
    }

    @Selector()
    static authError(state) {
        return state.user.error
    }
}