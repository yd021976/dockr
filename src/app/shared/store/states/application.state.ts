import { State, Selector } from '@ngxs/store';

import { ApplicationStateModel } from '../../models/application-state.model';
import { UserState } from '../states/user.state';
import { TemplatesState } from './templates.state';
import { RolesState } from './roles.state';
import { BackendServicesState } from './backend-services.state';

@State<ApplicationStateModel>({
    name: 'application',
    children: [UserState, TemplatesState, RolesState,BackendServicesState]
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