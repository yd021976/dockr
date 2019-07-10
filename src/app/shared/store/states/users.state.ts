import { State, Action, StateContext, Selector } from "@ngxs/store";
import { UsersModel, UserModel, UserModelBase } from "../../models/user.model";
import { Users_Load_All, Users_Load_All_Success, Users_Load_All_Error, Users_Select_User, Users_Update_User, Users_Update_User_Success, Users_Update_User_Error } from "../actions/users.action";

export const default_state_users: UsersModel = {
    users: [],
    selected_user: null,
    previous_state_users: null,
    isLoading: false,
    isError: false,
    error: ''
}

@State<UsersModel>( {
    name: 'users',
    defaults: default_state_users
} )
export class UsersState {
    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action( Users_Load_All )
    users_load_all( ctx: StateContext<UsersModel>, action: Users_Load_All ) {
        const current_users = ctx.getState().users
        ctx.patchState( {
            previous_state_users: current_users,
            isLoading: true,
            isError: false,
            error: ''
        } )
    }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action( Users_Load_All_Success )
    users_load_all_success( ctx: StateContext<UsersModel>, action: Users_Load_All_Success ) {
        ctx.patchState( {
            isLoading: false,
            isError: false,
            error: '',
            users: [ ...action.users ],
            previous_state_users: null
        } )
    }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action( Users_Load_All_Error )
    users_load_all_error( ctx: StateContext<UsersModel>, action: Users_Load_All_Error ) {
        const previous_state_users = ctx.getState().previous_state_users || []

        ctx.patchState( {
            isLoading: false,
            isError: true,
            error: action.error,
            users: previous_state_users
        } )
    }
    @Action( Users_Select_User )
    users_select_user( ctx: StateContext<UsersModel>, action: Users_Select_User ) {
        ctx.patchState( { selected_user: action.user } )
    }

    @Action( Users_Update_User )
    users_update_user( ctx: StateContext<UsersModel>, action: Users_Update_User ) {
        const previous_state_users = ctx.getState().users
        ctx.patchState( { isLoading: true, isError: false, error: '', previous_state_users: previous_state_users } )
    }
    @Action( Users_Update_User_Success )
    users_update_user_success( ctx: StateContext<UsersModel>, action: Users_Update_User_Success ) {
        // Find the user & replace with new user
        const state = ctx.getState()
        const index = state.users.findIndex( ( user ) => user._id == action.user._id )
        state.users[ index ] = action.user
        // Update selected user if it is the updated user
        const selected_user = ( state.selected_user._id == action.user._id ) ? action.user : state.selected_user

        // Patch state
        ctx.patchState( {
            isLoading: false,
            isError: false,
            error: '',
            users: [ ...state.users ],
            selected_user: selected_user,
            previous_state_users: null
        } )
    }
    @Action( Users_Update_User_Error )
    users_update_user_error( ctx: StateContext<UsersModel>, action: Users_Update_User_Error ) {
        const previous_state_users = ctx.getState().previous_state_users || []
        ctx.patchState( {
            isLoading: false,
            isError: true,
            error: action.error,
            users: previous_state_users,
            previous_state_users: null
        } )
    }



    /**
     * 
     * @param state 
     */
    @Selector()
    static users_list( state: UsersModel ) {
        return state.users
    }
    /**
     * 
     * @param state 
     */
    @Selector()
    static selected_user( state: UsersModel ) {
        return state.selected_user
    }
}