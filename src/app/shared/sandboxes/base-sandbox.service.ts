import { Observable, BehaviorSubject } from "rxjs";
import { Select, Store } from "@ngxs/store";

import { ApplicationState } from "../store/states/application.state";
import { UserModel } from "../models/user.model";
import { AppLoggerServiceInterface, LoggerMessage } from "../services/logger/app-logger/service/app-logger.service";

export abstract class BaseSandboxService {
    protected readonly loggerName: string = "base-app-sandbox";


    @Select( ApplicationState.isLoggedin ) protected _isLoggedin$: Observable<boolean>
    @Select( ApplicationState.getCurrentUser ) protected _currentUser$: Observable<UserModel>
    @Select( ApplicationState.isProgress ) protected _isProgress$: Observable<boolean>

    constructor( protected store: Store, protected loggerService: AppLoggerServiceInterface ) {
        this.loggerService.createLogger( this.loggerName )
    }

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
        this.loggerService.debug( this.loggerName, data )
    }
    public info( data: LoggerMessage ): void {
        this.loggerService.info( this.loggerName, data )
    }
    public error( data: LoggerMessage ): void {
        this.loggerService.error( this.loggerName, data )
    }
    public warn( data: LoggerMessage ): void {
        this.loggerService.warn( this.loggerName, data )
    }
}