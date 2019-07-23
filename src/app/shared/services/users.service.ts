import { Injectable, Inject } from "@angular/core";
import * as feathers from '@feathersjs/feathers';
import { FeathersjsBackendService } from "./backend_API_Endpoints/socketio/backend-feathers.service";
import { AppLoggerServiceToken } from "./logger/app-logger/app-logger-token";
import { AppLoggerService } from "./logger/app-logger/service/app-logger.service";
import { UserModelBase, UserBackendApiModel } from "../models/user.model";

@Injectable( { providedIn: 'root' } )
export class UsersService {
    private readonly loggerName: string = "UsersService";
    protected service: feathers.Service<any>;

    constructor( protected backendApiService: FeathersjsBackendService, @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerService ) {
        this.loggerService.createLogger( this.loggerName );
        this.service = this.backendApiService.service( 'users' );
    }

    public find( params?: any[] ): Promise<UserModelBase[]> {
        return this.service.find( params ? params : {} )
            .then( results => {
                return ( results.data as Array<any> ).map( ( user => {
                    return {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        anonymous: false,
                        roles: user.roles || [],
                        settings: user.settings || []
                    }
                } ) )
            } )
            .catch( err => {
                throw err
            } )
    }
    public update( user: UserModelBase, params?: any ): Promise<UserModelBase> {
        return this.service.patch( user._id, user, params )
            .then( backendUserResponse => {
                return backendUserResponse
            } )
    }

    public create( user: UserBackendApiModel, params?: any ): Promise<UserModelBase> {
        return this.service.create( user, params ? params : {} )
    }

    public remove( user: UserModelBase, params?: any ): Promise<UserModelBase> {
        return this.service.remove( user._id, params ? params : {} )
    }
}