import { RolesState } from "./roles.state";
import { BackendServicesState } from "./backend-services.state";
import { AclStateModel } from "src/app/shared/models/acl/acl.model";
import { State, Action, StateContext, Select, Selector } from "@ngxs/store";
import { CrudOperationsState } from "./crud-operations.state";
import { DataModelsState } from "./datamodels.state";
import { Acl_Roles_LoadAll, Acl_Roles_LoadAll_Success, Acl_Roles_LoadAll_Error } from "../../actions/acl/acl.actions";
import { v4 as uuid } from 'uuid';
import { RolesLoadAllSuccessAction } from "../../actions/acl/roles.actions";
import { RoleModel, RoleEntities } from "src/app/shared/models/acl/roles.model";
import { normalize, schema, Schema, denormalize } from 'normalizr'
import { DataModelsLoadAllSuccess } from "../../actions/acl/datamodels.actions";
import { CrudOperations_LoadAll_Success } from "../../actions/acl/crud-operations.actions";
import { BackendserviceLoadAllSuccess } from "../../actions/acl/backend-services.actions";

@State<AclStateModel>({
    name: 'acl',
    children: [RolesState, BackendServicesState, CrudOperationsState, DataModelsState]
})
export class AclState {
    static readonly schemaOptions = { idAttribute: 'uid', processStrategy: AclState.generateUUID }
    // define entities schemas
    static readonly fieldsSchema: Schema = new schema.Entity('fields', {}, AclState.schemaOptions)
    static readonly crudOperationsSchema: Schema = new schema.Entity('crud_operations', { fields: [AclState.fieldsSchema] }, AclState.schemaOptions)
    static readonly serviceSchema: Schema = new schema.Entity('services', { crud_operations: [AclState.crudOperationsSchema] }, AclState.schemaOptions)
    static readonly roleSchema: Schema = new schema.Entity('roles', { services: [AclState.serviceSchema] }, AclState.schemaOptions)
    static readonly mainSchema: Schema = new schema.Array(AclState.roleSchema)

    constructor() { }

    public static generateUUID(value) {
        if (!Object.prototype.hasOwnProperty.call(value, 'uid')) value['uid'] = uuid()
        return { ...value }
    }
    @Action(Acl_Roles_LoadAll)
    roles_load_all(ctx: StateContext<AclState>, action: Acl_Roles_LoadAll) {
    }

    @Action(Acl_Roles_LoadAll_Success)
    roles_load_all_success(ctx: StateContext<AclState>, action: Acl_Roles_LoadAll_Success) {
        var normalized = normalize(action.roles, AclState.mainSchema)
        // update sub states
        ctx.dispatch(new DataModelsLoadAllSuccess(normalized.entities['fields'])).toPromise().then(() => {
            ctx.dispatch(new CrudOperations_LoadAll_Success(normalized.entities['crud_operations'])).toPromise().then(() => {
                ctx.dispatch(new BackendserviceLoadAllSuccess(normalized.entities['services'])).toPromise().then(() => {
                    ctx.dispatch(new RolesLoadAllSuccessAction(normalized.entities['roles']))
                })
            })
        })
    }

    @Action(Acl_Roles_LoadAll_Error)
    roles_load_all_error(ctx: StateContext<AclState>, action: Acl_Roles_LoadAll_Error) { }

    @Selector()
    static getRoles(state: AclStateModel): RoleModel[] {
        var rolesUid = Object.keys(state.roles.entities)
        var objects = denormalize(rolesUid, AclState.mainSchema, {
            roles: state.roles.entities,
            services: state.backendServices.entities,
            crud_operations: state.crudOperations.entities,
            fields: state.datamodels.entities
        })
        return objects
    }
}