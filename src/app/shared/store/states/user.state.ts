import { Action, State, StateContext, Selector, Select } from '@ngxs/store';
import { UserModel } from '../../models/user.model';
import * as actions from '../actions/user.actions';
import { Inject } from '@angular/core';
import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../services/logger/app-logger/service/app-logger.service';
import { stat } from 'fs';

const defaultState: UserModel = {
    "nickname": '',
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
    defaults: defaultState
} )
export class UserState {
    private readonly loggerName: string = "UserState";

    constructor( @Inject( AppLoggerServiceToken ) protected loggerService: AppLoggerService ) {
        this.loggerService.createLogger( this.loggerName );
    }
    @Action( actions.UserLoginAction )
    login( ctx: StateContext<UserModel> ) {
        // When login action starts, user must be logged out
        return ctx.dispatch( new actions.UserLogoutSuccessAction() ).subscribe( () => {
            ctx.patchState( {
                "isProgress": true,
                "isLoggedIn": false,
                "isError": false,
                "error": ''
            } );
        } )
    }

    @Action( actions.UserLoginSuccessAction )
    loginSuccess( ctx: StateContext<UserModel>, action: actions.UserLoginSuccessAction ) {
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

    @Action( actions.UserLoginErrorAction )
    loginError( ctx: StateContext<UserModel>, action: actions.UserLoginErrorAction ) {
        ctx.patchState( {
            "isProgress": false,
            "isLoggedIn": false,
            "isAnonymous": true,
            "isError": true,
            "error": action.error
        } )
        this.loggerService.debug( this.loggerName, { message: 'loginError', otherParams: [ ctx.getState() ] } );
    }

    @Action( actions.UserLogoutAction )
    logout( ctx: StateContext<UserModel>, action: actions.UserLogoutAction ) {
        ctx.patchState( {
            "isProgress": true
        } )
        this.loggerService.debug( this.loggerName, { message: 'logout', otherParams: [ ctx.getState() ] } );
    }
    @Action( actions.UserLogoutSuccessAction )
    logoutSuccess( ctx: StateContext<UserModel>, action: actions.UserLogoutSuccessAction ) {
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
    @Action( actions.UserLogoutErrorAction )
    logoutError( ctx: StateContext<UserModel>, action: actions.UserLogoutErrorAction ) {
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