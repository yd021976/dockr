import { Action, State, StateContext, Selector, createSelector } from '@ngxs/store';
import { AppLoggerServiceToken } from '../../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../../services/logger/app-logger/service/app-logger.service';
import { Inject } from '@angular/core';
import { BackendServicesStateModel, BackendServiceEntity, BackendServicesEntities } from '../../../models/acl/backend-services.model';
import { BackendserviceLoadAllSuccess, BackendserviceLoadAll, BackendserviceLoadAllError, ServicesAddService, ServicesAddServiceSuccess } from '../../actions/acl/backend-services.actions';
import { v4 as uuid } from 'uuid';

@State<BackendServicesStateModel>({
    name: 'backendServices'
})
export class BackendServicesState {
    private readonly loggerName: string = "BackendServicesState";

    constructor(@Inject(AppLoggerServiceToken) public loggerService: AppLoggerService) {
        this.loggerService.createLogger(this.loggerName);
    }

    @Action(BackendserviceLoadAll)
    backendservices_load_all(ctx: StateContext<BackendServicesStateModel>, action: BackendserviceLoadAll) { }

    @Action(BackendserviceLoadAllSuccess)
    backendservices_load_all_success(ctx: StateContext<BackendServicesStateModel>, action: BackendserviceLoadAllSuccess) {
        ctx.setState({
            isLoading: false,
            isError: false,
            error: '',
            entities: action.backendservices

        })
    }

    @Action(BackendserviceLoadAllError)
    backendservices_load_all_error(ctx: StateContext<BackendServicesStateModel>, action: BackendserviceLoadAllError) { }
    @Action(ServicesAddServiceSuccess)
    backendservices_add_service_success(ctx: StateContext<BackendServicesStateModel>, action: ServicesAddServiceSuccess) {
        var service: BackendServiceEntity = {
            uid: action.service.uid,
            crud_operations: [],
            description: 'test',
            id: 'new service',
            name: "new service"
        }
        var state = ctx.getState()
        state.entities[service.uid] = service
        ctx.patchState({
            entities: { ...state.entities }
        })

    }
}