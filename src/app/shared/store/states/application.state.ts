import { State, Selector, Action, StateContext } from '@ngxs/store';

import { ApplicationStateModel } from '../../models/application-state.model';
import { UserState, default_state_user } from '../states/user.state';
import { TemplatesState, default_state_templates } from './templates.state';
import { ServicesState, default_state_services } from './services.state';
import { Acl2State } from './acl2/acl2.state';
import { Application_Event_Error } from '../actions/application.actions';
import { User_Action_Logout_Success } from '../actions/user.actions';
import { AppErrorsState, default_state_apperrors } from './errors.state';
import { ApplicationError_Shift_Error, ApplicationError_Append_Error } from '../actions/application-errors.actions';
import { AppError, errorType } from '../../models/app-error.model';

@State<ApplicationStateModel>( {
    name: 'application',
    children: [ UserState, TemplatesState, Acl2State, ServicesState, AppErrorsState ],
    defaults: {
        backendServices: default_state_services,
        templates: default_state_templates,
        user: default_state_user,
        appErrors: default_state_apperrors
    }
} )
export class ApplicationState {
    @Action( Application_Event_Error )
    application_event_error( ctx: StateContext<ApplicationStateModel>, action: Application_Event_Error ) {
        let state = ctx.getState()

        /**
         * Default : set error with action payload
         */
        let type: errorType = action.error[ 'type' ] ? action.error[ 'type' ] : 'other'
        let error = new AppError( action.error.message, type, action.error.name )

        /**
         * Special case : If error is 'notAuthenticated', check if user is currently logged in. If so, the error becomes "session expired"
         */
        if ( action.error.name == 'NotAuthenticated' ) {
            if ( state.user.isLoggedIn ) {
                error.message = "Session expired"
                error.name = "sessionExpired"
            } else {
                error.message = "You need to be authenticated. Data can't be loaded"
                error.name = action.error.name
            }
            // Finally, dispatch "log out" action to cleanup user state
            ctx.dispatch( new User_Action_Logout_Success() )
        }
       
        /**
         * Update app error state and append message
         */
        ctx.dispatch( new ApplicationError_Append_Error( error ) )
    }

    //
    // Selectors
    //

    /** Flag : is User logged in */
    @Selector()
    static isLoggedin( state: ApplicationStateModel ) {
        return state.user.isLoggedIn
    }

    /** */
    @Selector()
    static isProgress( state: ApplicationStateModel ): boolean {
        return ( state.user.isProgress as boolean ) || ( state.templates.isLoading as boolean )
    }

    @Selector()
    static getCurrentUser( state: ApplicationStateModel ) {
        return state.user
    }

    @Selector()
    static authError( state: ApplicationStateModel ) {
        return state.user.error
    }
}