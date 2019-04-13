import { State, Selector } from '@ngxs/store';

import { ApplicationStateModel } from '../../models/application-state.model';
import { UserState } from '../states/user.state';
import { TemplatesState } from './templates.state';
import { ServicesState } from './services.state';
import { Acl2State } from './acl2/acl2.state';

@State<ApplicationStateModel>({
    name: 'application',
    children: [UserState, TemplatesState, Acl2State, ServicesState]
})
export class ApplicationState {
    //
    // Selectors
    //

    /** Flag : is User logged in */
    @Selector()
    static isLoggedin(state: ApplicationStateModel) {
        return state.user.isLoggedIn
    }

    /** */
    @Selector()
    static isProgress(state: ApplicationStateModel): boolean {
        return (state.user.isProgress as boolean) || (state.templates.isLoading as boolean)
    }

    @Selector()
    static getCurrentUser(state: ApplicationStateModel) {
        return state.user
    }

    @Selector()
    static authError(state: ApplicationStateModel) {
        return state.user.error
    }
}