import { State, Action, StateContext, Selector } from "@ngxs/store";
import { UsersModel, UserModel, UserModelBase } from "../../models/user.model";
import { Users_Load_All, Users_Load_All_Success, Users_Load_All_Error, Users_Select_User, Users_Update_User, Users_Update_User_Success, Users_Update_User_Error, Users_Add, Users_Add_Success, Users_Add_Error, Users_Remove, Users_Remove_Success, Users_Remove_Error } from "../actions/users.action";
import * as _ from 'lodash';

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
        const current_users = _.cloneDeep( ctx.getState().users )
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
        const previous_state_users = _.cloneDeep( ctx.getState().users )
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

    @Action( Users_Add )
    users_add_user( ctx: StateContext<UsersModel>, action: Users_Add ) {
        const previous_state_users = _.cloneDeep( ctx.getState().users )

        // Add new user and sort by email asc
        let new_users = [ ..._.cloneDeep( ctx.getState().users ), action.user ]
        new_users.sort( ( a, b ) => {
            return a.email < b.email ? -1 : a.email == b.email ? 0 : 1
        } )

        // Update state
        ctx.patchState( {
            isLoading: true,
            isError: false,
            error: '',
            previous_state_users: previous_state_users,
            users: [ ...new_users ]
        } )

    }
    @Action( Users_Add_Success )
    users_add_user_success( ctx: StateContext<UsersModel>, action: Users_Add_Success ) {
        let new_users = _.cloneDeep( ctx.getState().users )

        // Update user ID after new user is inserted in backend
        let user = new_users.find( ( new_user ) => new_user.email == action.user.email )
        if ( user ) {
            user._id = action.user._id
        }
        else {
            ctx.dispatch( new Users_Add_Error( new Error( '[Users State] State error while finding user to update' ).message ) )
            return
        }
        ctx.patchState( {
            isLoading: false,
            isError: false,
            error: '',
            previous_state_users: null,
            users: [ ...new_users ]
        } )

    }
    @Action( Users_Add_Error )
    users_add_user_error( ctx: StateContext<UsersModel>, action: Users_Add_Error ) {
        const previous_state_users = ctx.getState().previous_state_users || []
        ctx.patchState( {
            isLoading: false,
            isError: true,
            error: action.error,
            users: [ ...previous_state_users ],
            previous_state_users: null
        } )
    }

    @Action( Users_Remove )
    users_remove_user( ctx: StateContext<UsersModel>, action: Users_Remove ) {
        const previous_state_users = _.cloneDeep( ctx.getState().users )
        let users = _.cloneDeep( ctx.getState().users )

        // Remove user from state
        let new_users = users.filter( ( user ) => user._id != action.user._id )

        // Filter users by "email" asc
        new_users.sort( ( a, b ) => {
            return a.email < b.email ? -1 : a.email == b.email ? 0 : 1
        } )

        ctx.patchState( {
            isLoading: true,
            isError: false,
            error: '',
            previous_state_users: previous_state_users,
            users: new_users
        } )
    }

    @Action( Users_Remove_Success )
    users_remove_user_success( ctx: StateContext<UsersModel>, action: Users_Remove_Success ) {
        ctx.patchState( {
            isLoading: false,
            isError: false,
            error: '',
            previous_state_users: null
        } )
    }
    @Action( Users_Remove_Error )
    users_remove_user_error( ctx: StateContext<UsersModel>, action: Users_Remove_Error ) {
        const previous_state_users = ctx.getState().previous_state_users || []
        ctx.patchState( {
            isLoading: false,
            isError: true,
            error: action.error,
            previous_state_users: null,
            users: previous_state_users
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