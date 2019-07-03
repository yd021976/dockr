import { State, Action, StateContext } from "@ngxs/store";
import { UsersModel } from "../../models/user.model";
import { Users_Load_All, Users_Load_All_Success, Users_Load_All_Error } from "../actions/users.action";

export const default_state_users: UsersModel = {
    users: [],
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
    users_load_all( ctx: StateContext<UsersModel>, action: Users_Load_All ) { }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action( Users_Load_All_Success )
    users_load_all_success( ctx: StateContext<UsersModel>, action: Users_Load_All_Success ) { }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action( Users_Load_All_Error )
    users_load_all_error( ctx: StateContext<UsersModel>, action: Users_Load_All_Error ) { }

}