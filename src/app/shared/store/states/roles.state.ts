import { Action, State, StateContext, Selector } from '@ngxs/store';
import { RolesModel, RolesNormalized } from '../../models/roles.model';
import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../services/logger/app-logger/service/app-logger.service';
import { Inject } from '@angular/core';
import { RolesLoadAction, RolesLoadSuccessAction, RolesLoadErrorAction } from '../actions/roles.actions';

@State<RolesModel>({
    name: 'roles'
})
export class RolesState {
    private readonly loggerName: string = "RolesState";

    constructor(@Inject(AppLoggerServiceToken) public loggerService: AppLoggerService) {
        this.loggerService.createLogger(this.loggerName);
    }
    @Action(RolesLoadAction)
    loadAllRoles(ctx: StateContext<RolesModel>) {
        ctx.patchState({
            isLoading: true,
            isError: false,
            error: ''
        })
    }

    @Action(RolesLoadSuccessAction)
    loadAllRolesSuccess(ctx: StateContext<RolesModel>, action: RolesLoadSuccessAction) {
        var normalized: RolesNormalized = {};
        action.roles.forEach((value) => {
            // Controle key doesn't already exist
            if (normalized[value._id]) { this.loggerService.warn(this.loggerName, { message: 'loadAllRolesSuccess()', otherParams: ['Duplicate role key', value._id] }) }
            else normalized[value._id] = value;
        })

        ctx.patchState({
            isLoading: false,
            isError: false,
            error: '',
            roles: normalized
        });
    }

    @Action(RolesLoadErrorAction)
    rolesloadAllError(ctx: StateContext<RolesModel>, action: RolesLoadErrorAction) {
        ctx.patchState({
            isLoading: false,
            isError: true,
            error: action.error,
            roles: {}
        })
    }

    @Selector()
    static isLoading(state: RolesModel) {
        return state.isLoading;
    }
    @Selector()
    static isError(state: RolesModel) {
        return state.isError;
    }
    @Selector()
    static error(state: RolesModel) {
        return state.isError ? state.error : '';
    }
    @Selector()
    static roles(state: RolesModel) {
        return state.roles
    }
}