import { State, Action, StateContext } from "@ngxs/store";
import { DataModelPropertyEntities, DataModelStateModel } from "src/app/shared/models/acl/datamodel.model";
import { DataModelsLoadAll, DataModelsLoadAllSuccess, DataModelsLoadAllError } from "../../actions/acl/datamodels.actions";

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
}