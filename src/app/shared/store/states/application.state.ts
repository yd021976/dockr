import { State, Selector, Action, StateContext } from '@ngxs/store';

import { ApplicationStateModel } from '../../models/application-state.model';
import { UserState, default_state_user } from '../states/user.state';
import { TemplatesState, default_state_templates } from './templates.state';
import { ServicesState, default_state_services } from './services.state';
import { AclUIState } from './acl/ui.state/acl2.state';
import { User_Action_Logout_Success } from '../actions/user.actions';
import { AppNotificationsState, default_state_application_notifications } from './application.notifications.state';
import { ApplicationNotifications_Append_Message } from '../actions/application-notifications.actions';
import { ApplicationNotification, ApplicationNotificationType } from '../../models/application.notifications.model';
import { UsersState, default_state_users } from './users.state';
import { Injectable } from '@angular/core';
import { ApplicationActions } from '../actions/application.actions';

@State<ApplicationStateModel>({
    name: 'application',
    children: [UserState, TemplatesState, AclUIState, ServicesState, AppNotificationsState, UsersState],
    defaults: {
        backendServices: default_state_services,
        templates: default_state_templates,
        user: default_state_user,
        users: default_state_users,
        notifications: default_state_application_notifications
    }
})

@Injectable()
export class ApplicationState {
    @Action(ApplicationActions.Application_Event_Notification)
    application_event_notification(ctx: StateContext<ApplicationStateModel>, action: ApplicationActions.Application_Event_Notification) {
        let state = ctx.getState()

        /**
         * Default : set error with action payload
         */
        let type: ApplicationNotificationType = action.Notification['type'] ? action.Notification['type'] : ApplicationNotificationType.INFO
        let notification = new ApplicationNotification(action.Notification.message, action.Notification.name, type)

        /**
         * Special case : If error is 'notAuthenticated', check if user is currently logged in. If so, the error becomes "session expired"
         */
        if (action.Notification.name == 'NotAuthenticated') {
            if (state.user.isLoggedIn) {
                notification.message = "Session expired"
                notification.name = "sessionExpired"
            } else {
                notification.message = "You need to be authenticated. Data can't be loaded"
                notification.name = action.Notification.name
            }
            // Finally, dispatch "log out" action to cleanup user state
            ctx.dispatch(new User_Action_Logout_Success())
        }

        /**
         * Update app error state and append message
         */
        ctx.dispatch(new ApplicationNotifications_Append_Message(notification))
    }

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