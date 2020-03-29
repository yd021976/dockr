import { Observable, BehaviorSubject } from "rxjs";
import { Select, Store } from "@ngxs/store";

import { ApplicationState } from "../store/states/application.state";
import { UserModel } from "../models/user.model";
import { AppLoggerServiceInterface, LoggerMessage } from "../services/logger/app-logger/service/app-logger.service";
import { Resolve } from "@angular/router";
import { ApplicationInjector } from "../application.injector.class";
import { AppLoggerServiceToken } from "../services/logger/app-logger/app-logger-token";

export abstract class BaseSandboxService implements Resolve<any> {
    // Base logger name
    protected readonly logger_name: string = "base-app-sandbox";

    protected store:Store
    protected loggerService:AppLoggerServiceInterface

    @Select( ApplicationState.isLoggedin ) public _isLoggedin$: Observable<boolean>
    @Select( ApplicationState.getCurrentUser ) public _currentUser$: Observable<UserModel>
    @Select( ApplicationState.isProgress ) public _isProgress$: Observable<boolean>

    constructor( ) {
        this.store = ApplicationInjector.injector.get( Store )
        this.loggerService = ApplicationInjector.injector.get( AppLoggerServiceToken )
        this.loggerService.createLogger( this.logger_name )
    }

    /**
     * Router : Route resolver
     */
    public abstract resolve( route, state )

    /**
     * Global application states
     */
    public get isLoggedin$(): Observable<boolean> {
        return this._isLoggedin$
    }
    public get currentUser$(): Observable<UserModel> {
        return this._currentUser$
    }
    public get isProgress$(): Observable<boolean> {
        return this._isProgress$
    }


    /**
     *  Log methods
     */
    public debug( data: LoggerMessage ): void {
        this.loggerService.debug( this.logger_name, data )
    }
    public info( data: LoggerMessage ): void {
        this.loggerService.info( this.logger_name, data )
    }
    public error( data: LoggerMessage ): void {
        this.loggerService.error( this.logger_name, data )
    }
    public warn( data: LoggerMessage ): void {
        this.loggerService.warn( this.logger_name, data )
    }
}