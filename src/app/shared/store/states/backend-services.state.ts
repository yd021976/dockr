import { Action, State, StateContext, Selector } from '@ngxs/store';
import { RolesModel, RoleModel, RolesNormalized } from '../../models/roles.model';
import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../services/logger/app-logger/service/app-logger.service';
import { Inject } from '@angular/core';
import { BackendServicesModel } from '../../models/backend-services.model';

@State<BackendServicesModel>({
    name: 'backendServices'
})
export class BackendServicesState {
    private readonly loggerName: string = "BackendServicesState";

    constructor(@Inject(AppLoggerServiceToken) public loggerService: AppLoggerService) {
        this.loggerService.createLogger(this.loggerName);
    }
}