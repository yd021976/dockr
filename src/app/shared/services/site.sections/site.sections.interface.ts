import * as feathers from '@feathersjs/feathers';
import { AppLoggerServiceToken } from '../logger/app-logger/app-logger-token';
import { AppLoggerServiceInterface } from '../logger/app-logger/service/app-logger.service';
import { ApplicationInjector } from '../../application.injector.class';
import { BackendServiceToken } from '../backend.api.endpoint/backend.service.token';
import { BackendBaseServiceInterface } from '../backend.api.endpoint/interfaces/backend.base.service';

export abstract class SiteSectionsServiceInterface {
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
}