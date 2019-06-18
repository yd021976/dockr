import { Injectable, Inject } from "@angular/core";
import * as feathers from '@feathersjs/feathers';
import { FeathersjsBackendService } from "../backend_API_Endpoints/socketio/backend-feathers.service";
import { AppLoggerServiceToken } from "../logger/app-logger/app-logger-token";
import { AppLoggerService } from "../logger/app-logger/service/app-logger.service";

@Injectable()
export class ResourcesLocksService {
    private readonly loggerName: string = "ResourcesLocks";
    protected service: feathers.Service<any>;

    constructor( protected backendApiService: FeathersjsBackendService, @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerService ) {
        this.loggerService.createLogger( this.loggerName );
        this.service = this.backendApiService.service( 'resources-locks' );
    }

    lock( resource_name: string ): Promise<any> {
        return this.service.get( resource_name )
    }
    release( resource_name: string ): Promise<any> {
        return this.service.remove( resource_name )
    }
    list( all_owners: boolean = false ): Promise<any> {
        return this.service.find( { all_owners: all_owners } )
    }
}