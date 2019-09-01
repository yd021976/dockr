import * as feathers from '@feathersjs/feathers';
import { Injectable, Inject } from "@angular/core";

import { AppError, errorType } from '../../models/application.error.model';
import { AppLoggerService } from '../logger/app-logger/service/app-logger.service';
import { AppLoggerServiceToken } from '../logger/app-logger/app-logger-token';
import { BackendServiceToken } from '../backend.api.endpoint/backend.service.token';
import { BackendBaseServiceInterface } from '../backend.api.endpoint/interfaces/backend.base.service';

@Injectable({ providedIn: 'root' })
export class TemplatesService {
    private readonly loggerName: string = "TemplatesService";
    protected service: feathers.Service<any>;

    constructor(@Inject(BackendServiceToken) protected backendApiService: BackendBaseServiceInterface, @Inject(AppLoggerServiceToken) public loggerService: AppLoggerService) {
        this.loggerService.createLogger(this.loggerName);
        this.service = this.backendApiService.service('templates');
    }

    public async find(params?:any): Promise<any> {
        // Ensure a valid JWT exist before request
        return this.service.find(params).catch((error) => {
            throw new AppError(error.message, errorType.backendError, error)
        });
    }
}