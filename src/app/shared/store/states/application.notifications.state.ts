import { State, Action, StateContext, Selector } from "@ngxs/store";
import { AppError, ApplicationNotificationsModel } from "../../models/app-error.model";
import { ApplicationNotifications_Append_Message, ApplicationNotifications_Shift_Message } from "../actions/application-notifications.actions";

export const default_state_apperrors: ApplicationNotificationsModel = { notifications: [] }

@State<ApplicationNotificationsModel>( {
    name: 'appErrors',
    defaults: default_state_apperrors
} )
export class AppNotificationsState {
    @Action( ApplicationNotifications_Append_Message )
    public applicationError_append_error( ctx: StateContext<ApplicationNotificationsModel>, action: ApplicationNotifications_Append_Message ) {
        let state:ApplicationNotificationsModel = JSON.parse( JSON.stringify( ctx.getState() ) ) // duplicate state
        /**
         * Avoid message duplicate : Remove existing message
         */
        let message_exist: number = state.notifications.findIndex( error => error.message == action.error.message )
        if ( message_exist != -1 ) {
            state.notifications.splice( message_exist, 1 )
        }
        state.notifications.push( action.error )

        /**
         * Only keep 5 last messages
         */
        if ( state.notifications.length > 5 ) {
            state.notifications.shift()
        }

        ctx.patchState( { notifications: [ ...state.notifications ] } )
    }

    @Action( ApplicationNotifications_Shift_Message )
    public applicationError_shift_error( ctx: StateContext<ApplicationNotificationsModel>, action: ApplicationNotifications_Shift_Message ) {
        let notifications: AppError[] = ctx.getState().notifications
        notifications.shift()
        ctx.patchState( { notifications: notifications } )
    }

    @Selector()
    static errorsList$( state: ApplicationNotificationsModel ) {
        return state.notifications.map( notification => {
            return notification.message
        } )
    }
}