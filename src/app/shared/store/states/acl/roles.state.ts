import { Action, State, StateContext, Selector } from '@ngxs/store';
import { RolesStateModel } from '../../../models/acl/roles.model';
import { AppLoggerServiceToken } from '../../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../../services/logger/app-logger/service/app-logger.service';
import { Inject } from '@angular/core';
import { RolesLoadAllAction, RolesLoadAllSuccessAction, RolesLoadAllErrorAction, RolesUpdateRoleAction, RolesUpdateRoleSuccessAction, RoleAddServiceSuccessAction } from '../../actions/acl/roles.actions';

@State<RolesStateModel>({
    name: 'roles',
    defaults: {
        isLoading: false,
        isError: false,
        error: '',
        entities: {}
    }
})
export class RolesState {
    private readonly loggerName: string = "RolesState";

    constructor(@Inject(AppLoggerServiceToken) public loggerService: AppLoggerService) {
        this.loggerService.createLogger(this.loggerName);
    }
    @Action(RolesLoadAllAction)
    loadAllRoles(ctx: StateContext<RolesStateModel>) {
        ctx.patchState({
            isLoading: true,
            isError: false,
            error: ''
        })
    }

    @Action(RolesLoadAllSuccessAction)
    loadAllRolesSuccess(ctx: StateContext<RolesStateModel>, action: RolesLoadAllSuccessAction) {
        ctx.setState({
            isLoading: false,
            isError: false,
            error: '',
            entities: action.roles
        })
    }

    @Action(RolesLoadAllErrorAction)
    rolesloadAllError(ctx: StateContext<RolesStateModel>, action: RolesLoadAllErrorAction) {
        ctx.patchState({
            isLoading: false,
            isError: true,
            error: action.error,
            entities: {}
        })
    }
    @Action(RolesUpdateRoleAction)
    roleUpdate(ctx: StateContext<RolesStateModel>) {
        ctx.patchState({
            isLoading: true,
            isError: false,
            error: ''
        })
    }
    @Action(RolesUpdateRoleSuccessAction)
    roleUpdateSuccess(ctx: StateContext<RolesStateModel>, action: RolesUpdateRoleSuccessAction) {
        Object.assign(ctx.getState().entities[action.role.id], action.role)
        var newRoles = { ...ctx.getState().entities, [action.role.id]: action.role }

        // ctx.patchState({
        //     isLoading: false,
        //     isError: false,
        //     error: '',
        //     roles: { ...ctx.getState().roles, [action.role.id]: action.role }
        // })
    }
    @Action(RoleAddServiceSuccessAction)
    role_add_service_success(ctx: StateContext<RolesStateModel>, action: RoleAddServiceSuccessAction) {
        var state = ctx.getState()
        var role = state.entities[action.roleUID]
        role.services.push(action.serviceUID)
        state.entities[action.roleUID] = role
        
        ctx.patchState({
            entities: { ...state.entities }
        })
    }
    @Selector()
    static isLoading(state: RolesStateModel) {
        return state.isLoading;
    }
    @Selector()
    static isError(state: RolesStateModel) {
        return state.isError;
    }
    @Selector()
    static error(state: RolesStateModel) {
        return state.isError ? state.error : '';
    }
    @Selector()
    static roles(state: RolesStateModel) {
        return state.entities
    }
}