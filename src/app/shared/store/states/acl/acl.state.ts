import { RolesState } from "./roles.state";
import { BackendServicesState } from "./backend-services.state";
import { AclStateModel } from "src/app/shared/models/acl/acl.model";
import { State, Action, StateContext, Select, Selector, Store, createSelector } from "@ngxs/store";
import { CrudOperationsState } from "./crud-operations.state";
import { DataModelsState } from "./datamodels.state";
import { Acl_Roles_LoadAll, Acl_Roles_LoadAll_Success, Acl_Roles_LoadAll_Error } from "../../actions/acl/acl.actions";
import { v4 as uuid } from 'uuid';
import { RolesLoadAllSuccessAction } from "../../actions/acl/roles.actions";
import { RoleModel } from "src/app/shared/models/acl/roles.model";
import { normalize, schema, Schema, denormalize } from 'normalizr'
import { DataModelsLoadAllSuccess } from "../../actions/acl/datamodels.actions";
import { CrudOperations_LoadAll_Success } from "../../actions/acl/crud-operations.actions";
import { BackendserviceLoadAllSuccess } from "../../actions/acl/backend-services.actions";
import { AclTreeNode, NODE_TYPES } from "src/app/shared/models/acl/treenode.model";

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


    // Return roles object array (denormalized data)
    @Selector()
    static getRoles(state: AclStateModel): RoleModel[] {
        var rolesUid = Object.keys(state.roles.entities)
        if (rolesUid.length == 0) return []

        var objects = denormalize(rolesUid, AclState.mainSchema, {
            roles: state.roles.entities,
            services: state.backendServices.entities,
            crud_operations: state.crudOperations.entities,
            fields: state.datamodels.entities
        })
        return objects
    }

    static getTreeNodesData(node: AclTreeNode = null) {
        return createSelector([AclState], (state: AclStateModel) => {
            var nodes: AclTreeNode[] = []

            if (node == null) {
                nodes = Object.keys(state.roles.entities).map((value) => {
                    var role = state.roles.entities[value]
                    return {
                        uid: role.uid,
                        name: role.name,
                        type: NODE_TYPES.ROLE
                    }
                })
            } else {
                nodes = AclState.getTreeNodeChildren(state, node)
            }
            return nodes
        })

    }
    /**
     * Get children of a node
     * @param state 
     * @param node 
     */
    static getTreeNodeChildren(state: AclStateModel, node: AclTreeNode): AclTreeNode[] {
        var children: AclTreeNode[] = []

        switch (node.type) {
            case NODE_TYPES.ROLE:
                var roleServices = state.roles.entities[node.uid].services
                children = roleServices.map((key) => {
                    var service = state.backendServices.entities[key]
                    return {
                        uid: service.uid,
                        type: NODE_TYPES.SERVICE,
                        name: service.name
                    }
                })
                break
            case NODE_TYPES.SERVICE:
                var serviceCrudOperations = state.backendServices.entities[node.uid].crud_operations
                children = serviceCrudOperations.map((key) => {
                    var crud = state.crudOperations.entities[key]
                    return {
                        uid: crud.uid,
                        name: crud.id,
                        type: NODE_TYPES.CRUD_OPERATION
                    }
                })
                break
            case NODE_TYPES.CRUD_OPERATION:
                var fields = state.crudOperations.entities[node.uid].fields
                children = fields.map((key) => {
                    var field = state.datamodels.entities[key]
                    return {
                        uid: field.uid,
                        name: field.id,
                        type: NODE_TYPES.FIELD_ACCESS
                    }
                })
                break
            case NODE_TYPES.FIELD_ACCESS:
                break
            default:
                break
        }
        return children
    }
}