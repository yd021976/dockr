import { RolesState } from "./roles.state";
import { BackendServicesState } from "./backend-services.state";
import { AclStateModel } from "src/app/shared/models/acl/acl.model";
import { State, Action, StateContext, Select, Selector, Store, createSelector } from "@ngxs/store";
import { CrudOperationsState } from "./crud-operations.state";
import { DataModelsState } from "./datamodels.state";
import { Acl_Roles_LoadAll, Acl_Roles_LoadAll_Success, Acl_Roles_LoadAll_Error, Acl_Select_node } from "../../actions/acl/acl.actions";
import { v4 as uuid } from 'uuid';
import { RolesLoadAllSuccessAction } from "../../actions/acl/roles.actions";
import { RoleModel, RoleEntity } from "src/app/shared/models/acl/roles.model";
import { normalize, schema, Schema, denormalize } from 'normalizr'
import { DataModelsLoadAllSuccess } from "../../actions/acl/datamodels.actions";
import { CrudOperations_LoadAll_Success } from "../../actions/acl/crud-operations.actions";
import { BackendserviceLoadAllSuccess } from "../../actions/acl/backend-services.actions";
import { AclTreeNode, NODE_TYPES } from "src/app/shared/models/acl/treenode.model";
import { BackendServiceEntity, BackendServiceModel } from "src/app/shared/models/acl/backend-services.model";
import { CrudOperationModelEntity } from "src/app/shared/models/acl/crud-operations.model";
import { DataModelPropertyEntity } from "src/app/shared/models/acl/datamodel.model";
import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";
import { ServicesState } from "../services.state";
import { ServicesModel } from "src/app/shared/models/services.model";

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
    roles_load_all_error(ctx: StateContext<AclStateModel>, action: Acl_Roles_LoadAll_Error) { }

    @Action(Acl_Select_node)
    acl_select_node(ctx: StateContext<AclStateModel>, action: Acl_Select_node) {
        const currentNode_roleEntity: RoleEntity = this.node_getRoleEntity(action.currentNode, ctx.getState())

        ctx.patchState(
            {
                currentSelectedNode: action.currentNode,
                currentSelectedNode_RoleEntity : currentNode_roleEntity
            }
        )
    }
    private node_getRoleEntity(node: FlatTreeNode, state: AclStateModel): RoleEntity {
        var roleEntity: RoleEntity = null
        var serviceEntity: BackendServiceEntity = null
        var crudEntity: CrudOperationModelEntity = null

        // If no node is selected, return null
        if (node==null) return null

        switch (node.data.type) {
            case NODE_TYPES.ROLE:
                roleEntity = state.roles.entities[node.data.uid]
                break
            case NODE_TYPES.SERVICE:
                roleEntity = this.service_getParent(node.data.uid, state)
                break
            case NODE_TYPES.CRUDOPERATION:
                serviceEntity = this.crud_getParent(node.data.uid, state)
                if (serviceEntity !== null) {
                    roleEntity = this.service_getParent(serviceEntity.uid, state)
                }
                break
            case NODE_TYPES.FIELDACCESS:
                crudEntity = this.field_getParent(node.data.uid, state)
                if (crudEntity !== null) {
                    serviceEntity = this.crud_getParent(crudEntity.uid, state)
                    if (serviceEntity !== null) {
                        roleEntity = this.service_getParent(serviceEntity.uid, state)
                    }
                }
                break
        }
        return roleEntity
    }

    /**
     * Get role entity from service UID
     * @param service_uid 
     * @param state 
     */
    private service_getParent(service_uid: string, state: AclStateModel): RoleEntity {
        var parentEntity: RoleEntity = null

        Object.keys(state.roles.entities).map((uid) => {
            if (state.roles.entities[uid].services.find((serviceUID) => serviceUID == service_uid)) {
                parentEntity = state.roles.entities[uid]
            }
        })
        return parentEntity
    }

    /**
     * Get Service entity from crud operation UID
     * @param crud_uid 
     * @param state 
     */
    private crud_getParent(crud_uid: string, state: AclStateModel): BackendServiceEntity {
        var serviceEntity: BackendServiceEntity = null

        Object.keys(state.aclServices.entities).map((serviceUID) => {
            if (state.aclServices.entities[serviceUID].crud_operations.find((crudUID) => crudUID == crud_uid)) {
                serviceEntity = state.aclServices.entities[serviceUID]
            }
        })
        return serviceEntity
    }

    /**
     * Get crud operation entity from field UID
     * @param field_uid 
     * @param state 
     */
    private field_getParent(field_uid: string, state: AclStateModel): CrudOperationModelEntity {
        var crudEntity: CrudOperationModelEntity = null
        Object.keys(state.crudOperations.entities).map((crudUID) => {
            if (state.crudOperations.entities[crudUID].fields.find((fieldUID) => fieldUID == field_uid)) {
                crudEntity = state.crudOperations.entities[crudUID]
            }
        })
        return crudEntity
    }

    @Selector()
    static currentRoleEntity(aclstate: AclStateModel): RoleEntity {
        return aclstate.currentSelectedNode_RoleEntity
    }
    @Selector([ServicesState])
    static availableRoleServices(aclState: AclStateModel, serviceState: ServicesModel) {
        if (aclState.currentSelectedNode_RoleEntity == null) return [] // no node is selected

        var currentRoleUid: string = aclState.currentSelectedNode_RoleEntity.uid
        var availableServices: BackendServiceModel[] = []
        var roleHasServices: string

        if (currentRoleUid != '') {
            availableServices = serviceState.services.filter((service) => {
                roleHasServices = aclState.roles.entities[currentRoleUid].services.find((value) => {
                    if (aclState.aclServices.entities[value].id == service.id){ 
                        return true
                    }
                })
                // If service doesn't exist in role, it can be added to the role
                if (roleHasServices==undefined) {
                    return true
                }
            })
        }
        return availableServices
    }
    @Selector()
    static currentSelectedNode(state: AclStateModel): FlatTreeNode {
        return state.currentSelectedNode
    }
    @Selector()
    static currentSelectedNode_UID(state: AclStateModel) {
        return state.currentSelectedNode
    }
    static currentSelectedNode_Entity(state: AclStateModel): RoleEntity | BackendServiceEntity | CrudOperationModelEntity | DataModelPropertyEntity | null {
        var entity: RoleEntity | BackendServiceEntity | CrudOperationModelEntity | DataModelPropertyEntity = null;
        var nodeuid = state.currentSelectedNode.data['uid']
        entity =
            state.roles.entities[nodeuid]
            || state.aclServices.entities[nodeuid]
            || state.crudOperations.entities[nodeuid]
            || state.datamodels.entities[nodeuid];

        return entity
    }
    // Return roles object array (denormalized data)
    @Selector()
    static getRoles(state: AclStateModel): RoleModel[] {
        var rolesUid = Object.keys(state.roles.entities)
        if (rolesUid.length == 0) return []

        var objects = denormalize(rolesUid, AclState.mainSchema, {
            roles: state.roles.entities,
            services: state.aclServices.entities,
            crud_operations: state.crudOperations.entities,
            fields: state.datamodels.entities
        })
        return objects
    }

    static getTreeNodesData(node: AclTreeNode = null) {
        return createSelector([AclState], (state: AclStateModel): AclTreeNode[] => {
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
                    var service = state.aclServices.entities[key]
                    return {
                        uid: service.uid,
                        type: NODE_TYPES.SERVICE,
                        name: service.name
                    }
                })
                break
            case NODE_TYPES.SERVICE:
                var serviceCrudOperations = state.aclServices.entities[node.uid].crud_operations
                children = serviceCrudOperations.map((key) => {
                    var crud = state.crudOperations.entities[key]
                    return {
                        uid: crud.uid,
                        name: crud.id,
                        checked: crud.allowed,
                        type: NODE_TYPES.CRUDOPERATION
                    }
                })
                break
            case NODE_TYPES.CRUDOPERATION:
                var fields = state.crudOperations.entities[node.uid].fields
                children = fields.map((key) => {
                    var field = state.datamodels.entities[key]
                    return {
                        uid: field.uid,
                        name: field.id,
                        checked: field.allowed,
                        type: NODE_TYPES.FIELDACCESS
                    }
                })
                break
            case NODE_TYPES.FIELDACCESS:
                break
            default:
                break
        }
        return children
    }
}