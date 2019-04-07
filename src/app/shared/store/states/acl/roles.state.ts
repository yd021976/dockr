import { Action, State, StateContext, Selector } from '@ngxs/store';
import { RolesStateModel, RoleEntity } from '../../../models/acl/roles.model';
import { AppLoggerServiceToken } from '../../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../../services/logger/app-logger/service/app-logger.service';
import { Inject } from '@angular/core';
import { RolesLoadAllAction, RolesLoadAllSuccessAction, RolesLoadAllErrorAction, RolesUpdateRoleAction, RolesUpdateRoleSuccessAction, RoleAddServiceSuccessAction, RolesAddRoleAction, RolesAddRoleSuccessAction, RolesAddRoleErrorAction, RolesRemoveRoleAction, RolesRemoveRoleSuccessAction } from '../../actions/acl/roles.actions';
import { v4 as uuid } from 'uuid';

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
        //TODO: Implement role state "update role"

        // ctx.patchState({
        //     isLoading: false,
        //     isError: false,
        //     error: '',
        //     roles: { ...ctx.getState().roles, [action.role.id]: action.role }
        // })
    }
    @Action(RolesAddRoleAction)
    role_add_role(ctx: StateContext<RolesStateModel>, action: RolesAddRoleAction) {
        //TODO: Implement role state action "add role action"
    }
    @Action(RolesAddRoleSuccessAction)
    role_add_role_success(ctx: StateContext<RolesStateModel>, action: RolesAddRoleSuccessAction) {
        var state = ctx.getState()
        const roleUid = uuid()
        const roleEntity: RoleEntity = {
            id: action.roleName,
            name: action.roleName,
            uid: roleUid,
            services: []
        }
        ctx.patchState({
            entities: { ...state.entities, [roleUid]: roleEntity }
        })
    }
    @Action(RolesAddRoleErrorAction)
    role_add_role_error(ctx: StateContext<RolesStateModel>, action: RolesAddRoleSuccessAction) {
        //TODO: Implement role state action "add role error action"
    }

    @Action(RolesRemoveRoleAction)
    role_remove_role(ctx: StateContext<RolesStateModel>, action: RolesRemoveRoleAction) {
        //TODO: Implement role state action "remove role action"

    }
    @Action(RolesRemoveRoleSuccessAction)
    role_remove_role_success(ctx: StateContext<RolesStateModel>, action: RolesRemoveRoleSuccessAction) {
        var state = ctx.getState()
        delete state.entities[action.roleUid]
        ctx.patchState({
            entities:{...state.entities}
        })
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