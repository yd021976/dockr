import { Action, State, StateContext, Selector, Select } from '@ngxs/store';
import { UserModel } from '../../models/user.model';
import * as actions from '../actions/user.actions';
import { Inject } from '@angular/core';
import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../services/logger/app-logger/service/app-logger.service';
import { stat } from 'fs';

export const default_state_user: UserModel = {
    "_id": '',
    "anonymous": false,
    "name": '',
    "email": '',
    "isLoggedIn": false,
    "isAnonymous": true,
    "isProgress": false,
    "isError": false,
    "error": '',
    "roles": [],
    "settings": []
}

@State<UserModel>( {
    name: 'user',
    defaults: default_state_user
} )
export class UserState {
    private readonly loggerName: string = "UserState";

    constructor( @Inject( AppLoggerServiceToken ) protected loggerService: AppLoggerService ) {
        this.loggerService.createLogger( this.loggerName );
    }

    /**
     * 
     * @param ctx 
     */
    @Action( actions.User_Action_Login )
    login( ctx: StateContext<UserModel> ) {
        // When login action starts, user must be logged out
        return ctx.dispatch( new actions.User_Action_Logout_Success() ).subscribe( () => {
            ctx.patchState( {
                "isProgress": true,
                "isLoggedIn": false,
                "isError": false,
                "error": ''
            } );
        } )
    }

    @Action( actions.User_Action_Login_Success )
    loginSuccess( ctx: StateContext<UserModel>, action: actions.User_Action_Login_Success ) {
        let c = ctx.getState();
        let isAnonymous: boolean = action.user == null ? true : false
        let nickname: string = action.user == null ? '' : action.user[ 'nickname' ] ? action.user[ 'nickname' ] : action.user[ 'email' ]
        let email: string = action.user == null ? '' : action.user[ 'email' ]
        let isLoggedIn: boolean = action.user == null ? false : true

        ctx.patchState( {
            "nickname": nickname,
            "email": email,
            "isAnonymous": isAnonymous,
            "isLoggedIn": isLoggedIn,
            "isProgress": false,
            "isError": false,
            "error": ''
        } );
        this.loggerService.debug( this.loggerName, { message: 'loginSucess', otherParams: [ ctx.getState() ] } );

    }

    @Action( actions.User_Action_Login_Error )
    loginError( ctx: StateContext<UserModel>, action: actions.User_Action_Login_Error ) {
        ctx.patchState( {
            "isProgress": false,
            "isLoggedIn": false,
            "isAnonymous": true,
            "isError": true,
            "error": action.error
        } )
        this.loggerService.debug( this.loggerName, { message: 'loginError', otherParams: [ ctx.getState() ] } );
    }

    @Action( actions.User_Action_Logout )
    logout( ctx: StateContext<UserModel>, action: actions.User_Action_Logout ) {
        ctx.patchState( {
            "isProgress": true
        } )
        this.loggerService.debug( this.loggerName, { message: 'logout', otherParams: [ ctx.getState() ] } );
    }
    @Action( actions.User_Action_Logout_Success )
    logoutSuccess( ctx: StateContext<UserModel>, action: actions.User_Action_Logout_Success ) {
        // ctx.setState(defaultState);
        ctx.patchState( {
            "isProgress": false,
            "isAnonymous": true,
            "email": '',
            "roles": [],
            "settings": [],
            "nickname": '',
            "error": '',
            "isError": false,
            "isLoggedIn": false
        } )
        this.loggerService.debug( this.loggerName, { message: 'logoutSuccess', otherParams: [ ctx.getState() ] } );
    }
    @Action( actions.User_Action_Logout_Error )
    logoutError( ctx: StateContext<UserModel>, action: actions.User_Action_Logout_Error ) {
        ctx.patchState( {
            "isProgress": false,
            "isLoggedIn": false,
            "isAnonymous": true,
            "isError": true,
            "error": action.error
        } )
    }

    /**
     * TODO: Implement correct isLoggedin selector
     */
    @Selector()
    static isLoggedin( state: UserModel ) {
        return state.isLoggedIn
    }
}