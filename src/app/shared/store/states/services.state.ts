import { State, Action, StateContext, Selector } from "@ngxs/store";
import { ServicesLoadAll_Success } from "../actions/services.actions";
import { ServicesModel } from "../../models/services.model";

/**
 * Manage all available backend service
 */

@State<ServicesModel>(
    {
        name: 'backendServices'
    }
)
export class ServicesState {
    @Action(ServicesLoadAll_Success)
    public services_loadall_success(ctx: StateContext<ServicesModel>, action: ServicesLoadAll_Success) {
        ctx.patchState({
            isLoading: false,
            isError: false,
            error: '',
            services: action.services
        })
    }

    @Selector()
    static services(state: ServicesModel) {
        return state.services
    }
    @Selector()
    static isLoading(state: ServicesModel) {
        return state.isLoading
    }
    @Selector()
    static isError(state: ServicesModel) {
        return state.isError
    }
    @Selector()
    static error(state: ServicesModel) {
        return state.error
    }


}