import { State, Action, StateContext } from "@ngxs/store";
import { CrudOperationsModelEntities, CrudOperationsStateModel } from "src/app/shared/models/acl/crud-operations.model";
import { CrudOperations_LoadAll, CrudOperations_LoadAll_Success, CrudOperations_LoadAll_Error } from "../../actions/acl/crud-operations.actions";

@State<CrudOperationsStateModel>({ name: 'crudOperations' })
export class CrudOperationsState {
    @Action(CrudOperations_LoadAll)
    crudoperations_load_all(ctx: StateContext<CrudOperationsStateModel>, action: CrudOperations_LoadAll) { }

    @Action(CrudOperations_LoadAll_Success)
    crudoperations_load_all_success(ctx: StateContext<CrudOperationsStateModel>, action: CrudOperations_LoadAll_Success) {
        ctx.setState({
            isLoading: false,
            isError: false,
            error: '',
            entities: action.crudOperations

        })
    }

    @Action(CrudOperations_LoadAll_Error)
    crudoperations_load_all_error(ctx: StateContext<CrudOperationsStateModel>, action: CrudOperations_LoadAll_Error) { }
}