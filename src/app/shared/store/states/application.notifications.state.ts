import { State, Action, StateContext, Selector } from "@ngxs/store";
import { AppError } from "../../models/app-error.model";
import { ApplicationNotifications_Append_Message, ApplicationNotifications_Shift_Message, ApplicationNotifications_Remove_Message } from "../actions/application-notifications.actions";
import { ApplicationNotificationsModel, ApplicationNotification } from "../../models/application.notifications.model";

export const default_state_application_notifications: ApplicationNotificationsModel = { notifications: [] }

@State<ApplicationNotificationsModel>( {
    name: 'ApplicationNotifications',
    defaults: default_state_application_notifications
} )
export class AppNotificationsState {
    /**
     * Action
     * 
     * Add a new message
     * 
     * @param ctx 
     * @param action 
     */
    @Action( ApplicationNotifications_Append_Message )
    public application_notification_append_message( ctx: StateContext<ApplicationNotificationsModel>, action: ApplicationNotifications_Append_Message ) {
        let state: ApplicationNotificationsModel = JSON.parse( JSON.stringify( ctx.getState() ) ) // duplicate state
        /**
         * Avoid message duplicate : Remove existing message
         */
        let message_exist: number = state.notifications.findIndex( notification => notification.message == action.notification.message )
        if ( message_exist != -1 ) {
            state.notifications.splice( message_exist, 1 )
        }
        state.notifications.push( action.notification )

        /**
         * Only keep 5 last messages
         */
        if ( state.notifications.length > 5 ) {
            state.notifications.shift()
        }

        ctx.patchState( { notifications: [ ...state.notifications ] } )
    }

    /**
     * Action
     * 
     * Remove last message in queue
     * 
     * @param ctx 
     * @param action 
     */
    @Action( ApplicationNotifications_Shift_Message )
    public application_notification_shift_message( ctx: StateContext<ApplicationNotificationsModel>, action: ApplicationNotifications_Shift_Message ) {
        let notifications: ApplicationNotification[] = ctx.getState().notifications
        notifications.shift()
        ctx.patchState( { notifications: notifications } )
    }

    @Action( ApplicationNotifications_Remove_Message )
    public application_notification_remove_message( ctx: StateContext<ApplicationNotificationsModel>, action: ApplicationNotifications_Remove_Message ) {
        let state = ctx.getState()
        const notification = state.notifications[ action.message_index ]

        // Check index exists
        if ( notification != null ) {
            state.notifications.splice( action.message_index, 1 )
            ctx.patchState( { notifications: [ ...state.notifications ] } )
        }
    }
    /**
     * Selector
     * 
     * Get message list
     * 
     * @param state 
     */
    @Selector()
    static notifications$( state: ApplicationNotificationsModel ) {
        return state.notifications
        // return state.notifications.map( (notification:ApplicationNotification) => {
        //     return notification.message
        // } )
    }
}