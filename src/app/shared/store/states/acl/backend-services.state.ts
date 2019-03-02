import { Action, State, StateContext, Selector } from '@ngxs/store';
import { AppLoggerServiceToken } from '../../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../../services/logger/app-logger/service/app-logger.service';
import { Inject } from '@angular/core';
import { BackendServicesStateModel } from '../../../models/acl/backend-services.model';
import { BackendserviceLoadAllSuccess, BackendserviceLoadAll, BackendserviceLoadAllError } from '../../actions/acl/backend-services.actions';

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
}