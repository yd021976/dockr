import { State, Action, StateContext, Selector } from "@ngxs/store";
import { AppError, ApplicationErrorModel } from "../../models/app-error.model";
import { ApplicationError_Append_Error, ApplicationError_Shift_Error } from "../actions/application-errors.actions";

export const default_state_apperrors: ApplicationErrorModel = { errors: [] }

@State<ApplicationErrorModel>( {
    name: 'appErrors',
    defaults: default_state_apperrors
} )
export class AppErrorsState {
    @Action( ApplicationError_Append_Error )
    public applicationError_append_error( ctx: StateContext<ApplicationErrorModel>, action: ApplicationError_Append_Error ) {
        let state = JSON.parse( JSON.stringify( ctx.getState() ) ) // duplicate state
        /**
         * Avoid message duplicate : Remove existing message
         */
        let message_exist: number = state.errors.findIndex( error => error.message == action.error.message )
        if ( message_exist != -1 ) {
            state.errors.splice( message_exist, 1 )
        }
        state.errors.push( action.error )

        /**
         * Only keep 5 last messages
         */
        if ( state.errors.length > 5 ) {
            state.errors.shift()
        }

        ctx.patchState( { errors: [ ...state.errors ] } )
    }

    @Action( ApplicationError_Shift_Error )
    public applicationError_shift_error( ctx: StateContext<ApplicationErrorModel>, action: ApplicationError_Shift_Error ) {
        let errors: AppError[] = ctx.getState().errors
        errors.shift()
        ctx.patchState( { errors: errors } )
    }

    @Selector()
    static errorsList$( state: ApplicationErrorModel ) {
        return state.errors.map( error => {
            return error.message
        } )
    }
}