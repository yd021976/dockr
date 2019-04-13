import { State, Action, StateContext, createSelector } from "@ngxs/store";
import { CrudOperationsModelEntities, CrudOperationsStateModel } from "src/app/shared/models/acl/crud-operations.model";
import { CrudOperations_LoadAll, CrudOperations_LoadAll_Success, CrudOperations_LoadAll_Error, CrudOperations_Update_Success, CrudOperations_Update_Error, CrudOperations_Add_Operations_Success } from "../../actions/acl/crud-operations.actions";
import { DataModelsState } from "./datamodels.state";
import { DataModelStateModel, DataModelPropertyEntity } from "src/app/shared/models/acl/datamodel.model";

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

    @Action(CrudOperations_Update_Success)
    crudoperations_update_success(ctx: StateContext<CrudOperationsStateModel>, action: CrudOperations_Update_Success) {
        var state = ctx.getState()
        state.entities[action.entity.uid] = action.entity
        ctx.patchState({
            entities: { ...state.entities }
        })
    }
    @Action(CrudOperations_Update_Error)
    crudoperations_update_error(ctx: StateContext<CrudOperationsStateModel>, action: CrudOperations_Update_Error) {

    }
    @Action(CrudOperations_Add_Operations_Success)
    crudoperations_add_operations_success(ctx: StateContext<CrudOperationsStateModel>, action: CrudOperations_Add_Operations_Success) {
        const state = ctx.getState()
        ctx.patchState({
            entities: { ...state.entities, ...action.operationEntities }
        })
    }
    static getEntity(nodeUID: string) {
        return createSelector([CrudOperationsState], (state: CrudOperationsStateModel) => {
            return state.entities[nodeUID]
        })
    }
    static getChildren(parentUID: string) {
        return createSelector([CrudOperationsState, DataModelsState], (actionsState: CrudOperationsStateModel, fieldsState: DataModelStateModel) => {
            var children: DataModelPropertyEntity[]

            children = actionsState.entities[parentUID].fields.map((fieldEntityUid) => {
                return fieldsState.entities[fieldEntityUid]
            })
            return children
        })
    }
}