import * as feathers from '@feathersjs/feathers';
import { Injectable, Inject } from "@angular/core";

import { FeathersjsBackendService } from "../../backend/socketio/backend-feathers.service";
import { AppError, errorType } from '../../../models/app-error.model';
import { AppLoggerService } from '../../logger/app-logger/service/app-logger.service';
import { AppLoggerServiceToken } from '../../logger/app-logger/app-logger-token';
import * as DATA from './roles.data';
import { RoleModel } from 'src/app/shared/models/roles.model';

@Injectable({ providedIn: 'root' })
export class RolesService {
    private readonly loggerName: string = "RolesService";
    protected service: feathers.Service<any>;

    constructor(protected backendApiService: FeathersjsBackendService, @Inject(AppLoggerServiceToken) public loggerService: AppLoggerService) {
        this.loggerService.createLogger(this.loggerName);
        this.service = this.backendApiService.service('roles');
    }

    public async find(params?: any): Promise<RoleModel[]> {
        return new Promise((resolve, reject) => {
            resolve(DATA.default)
        });
        
        //TODO: Get data from server
        //
        // Ensure a valid JWT exist before request
        // return this.service.find(params).catch((error) => {
        //     throw new AppError(error.message, errorType.backendError, error)
        // });
    }
}