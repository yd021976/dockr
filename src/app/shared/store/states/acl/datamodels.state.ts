import { State, Action, StateContext, Selector, createSelector } from "@ngxs/store";
import { DataModelPropertyEntities, DataModelStateModel } from "src/app/shared/models/acl/datamodel.model";
import { DataModelsLoadAll, DataModelsLoadAllSuccess, DataModelsLoadAllError, DataModelUpdateSuccess } from "../../actions/acl/datamodels.actions";
import { ApplicationState } from "../application.state";
import { ApplicationStateModel } from "src/app/shared/models/application-state.model";

@State<DataModelStateModel>({ name: 'datamodels' })
export class DataModelsState {
    @Action(DataModelsLoadAll)
    datamodels_load_all(ctx: StateContext<DataModelStateModel>, action: DataModelsLoadAll) { }

    @Action(DataModelsLoadAllSuccess)
    datamodels_load_all_success(ctx: StateContext<DataModelStateModel>, action: DataModelsLoadAllSuccess) {
        ctx.setState({
            isLoading: false,
            isError: false,
            error: '',
            entities: action.datamodels
        })
    }

    @Action(DataModelsLoadAllError)
    datamodels_load_all_error(ctx: StateContext<DataModelStateModel>, action: DataModelsLoadAllError) { }

    @Action(DataModelUpdateSuccess)
    datamodel_update_success(ctx: StateContext<DataModelStateModel>, action: DataModelUpdateSuccess) {
        var state = ctx.getState()
        state.entities[action.field.uid] = action.field

        ctx.patchState({
            entities: { ...state.entities }
        })
    }

    static getEntity(nodeUID: string) {
        return createSelector([DataModelsState], (state: DataModelStateModel) => {
            return state.entities[nodeUID]
        })
    }
}