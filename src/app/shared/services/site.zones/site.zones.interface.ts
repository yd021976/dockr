import * as feathers from '@feathersjs/feathers';
import { AppLoggerServiceToken } from '../logger/app-logger/app-logger-token';
import { AppLoggerServiceInterface } from '../logger/app-logger/service/app-logger.service';
import { ApplicationInjector } from '../../application.injector.class';
import { BackendServiceToken } from '../backend.api.endpoint/backend.service.token';
import { BackendBaseServiceInterface } from '../backend.api.endpoint/interfaces/backend.base.service';
import { BackendMethodsInterface } from '../backend.api.endpoint/interfaces/backend.service.methods.interface';

export abstract class SiteZonesServiceInterface implements BackendMethodsInterface {
    protected readonly loggerName: string = "site-sections-service"
    protected readonly serviceName: string = "site-sections"
    protected service: feathers.Service<any>
    protected backendApiService: BackendBaseServiceInterface
    protected loggerService: AppLoggerServiceInterface

    constructor() {
        this.backendApiService = ApplicationInjector.injector.get( BackendServiceToken )
        this.loggerService = ApplicationInjector.injector.get( AppLoggerServiceToken )

        this.loggerService.createLogger( this.loggerName )
        this.service = this.backendApiService.service( this.serviceName )
    }

    public abstract find( params? )
    public abstract create( id, param )
    public abstract delete( id, param )
    public abstract get( id, params )
    public abstract patch( id, param )
    public abstract update( id, param )
}