import { Injectable, Inject } from "@angular/core";
import * as feathers from '@feathersjs/feathers';
import { FeathersjsBackendService } from "./backend_API_Endpoints/socketio/backend-feathers.service";
import { AppLoggerServiceToken } from "./logger/app-logger/app-logger-token";
import { AppLoggerService } from "./logger/app-logger/service/app-logger.service";
import { UserModelBase } from "../models/user.model";

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
                        email:user.email,
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
}