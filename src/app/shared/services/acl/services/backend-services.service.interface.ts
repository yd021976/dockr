import * as feathers from "@feathersjs/feathers"
import { BackendBaseServiceInterface } from "../../backend.api.endpoint/interfaces/backend.base.service"
import { AppLoggerServiceInterface } from "../../logger/app-logger/service/app-logger.service"
import { ApplicationInjector } from "src/app/shared/application.injector.class"
import { BackendServiceToken } from "../../backend.api.endpoint/backend.service.token"
import { AppLoggerServiceToken } from "../../logger/app-logger/app-logger-token"
import { BackendMethodsInterface } from "../../backend.api.endpoint/interfaces/backend.service.methods.interface"
import { BackendServiceModel } from "src/app/shared/models/acl.services.model"

export abstract class BackendServicesInterface implements BackendMethodsInterface{
    protected readonly loggerName: string = "backend-services"
    protected readonly serviceName: string = "service-model"
    protected service: feathers.Service<any>
    protected backendApiService: BackendBaseServiceInterface
    protected loggerService: AppLoggerServiceInterface

    constructor() {
        this.backendApiService = ApplicationInjector.injector.get( BackendServiceToken )
        this.loggerService = ApplicationInjector.injector.get( AppLoggerServiceToken )

        this.loggerService.createLogger( this.loggerName )
        this.service = this.backendApiService.service( this.serviceName )
    }

    public abstract find( params? ):Promise<any>
    public abstract create( id, param? )
    public abstract delete( id, param? )
    public abstract get( id, params? ):Promise<any>
    public abstract patch( id, param? )
    public abstract update( id, param? )
    protected abstract formatBackendServiceModel(services: any[]): BackendServiceModel[]
}