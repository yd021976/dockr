import { Inject } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngxs/store";
import { v4 as uuid } from 'uuid';

import { AclState } from "../../store/states/acl/state/acl.state";
import { AclTreeNode } from "../../models/acl/treenode.model";
import { Acl_Roles_LoadAll_Success, Acl_Select_node } from "../../store/actions/acl/acl.actions";
import { AppLoggerService } from "../../services/logger/app-logger/service/app-logger.service";
import { AppLoggerServiceToken } from "../../services/logger/app-logger/app-logger-token";
import { BackendServiceModel } from "../../models/acl/backend-services.model";
import { BaseSandboxService } from "../base-sandbox.service";
import { DataModelUpdateSuccess, DataModelUpdateError } from "../../store/actions/acl/datamodels.actions";
import { DataModelPropertyEntity, DataModelPropertyEntities } from "../../models/acl/datamodel.model";
import { DataModelsState } from "../../store/states/acl/datamodels.state";
import { NotificationBaseService } from "../../services/notifications/notifications-base.service";
import { RolesService } from "../../services/acl/roles/roles.service";
import { RoleAddServiceSuccessAction, RolesAddRoleSuccessAction, RolesRemoveRoleSuccessAction } from "../../store/actions/acl/roles.actions";
import { RoleModel } from "../../models/acl/roles.model";
import { ServicesAddServiceSuccess } from "../../store/actions/acl/backend-services.actions";
import { CrudOperationModelEntity } from "../../models/acl/crud-operations.model";
import { CrudOperationsState } from "../../store/states/acl/crud-operations.state";
import { CrudOperations_Update_Success, CrudOperations_Update_Error } from "../../store/actions/acl/crud-operations.actions";
import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";
import { ServicesState } from "../../store/states/services.state";
import { BackendServicesService } from "../../services/acl/services/backend-services.service";
import { ServicesLoadAll_Success } from "../../store/actions/services.actions";

@Inject({ providedIn: 'root' })
export class AdminAclSandboxService extends BaseSandboxService {
    public acltreenodes$: Observable<AclTreeNode[]>
    public currentSelectedNode$: Observable<FlatTreeNode>
    public availableServices$: Observable<any>

    constructor(
        notificationService: NotificationBaseService,
        store: Store,
        @Inject(AppLoggerServiceToken) public logger: AppLoggerService,
        private rolesService: RolesService,
        private backendServices: BackendServicesService) {
        super(notificationService, store, logger);
        this.acltreenodes$ = this.store.select(AclState.getTreeNodesData()) // ACL Observable
        this.currentSelectedNode$ = this.store.select(AclState.currentSelectedNode)
        this.availableServices$ = this.store.select(AclState.availableRoleServices)
    }

    /**
     * Load ACL's data
     */
    init() {
        this.rolesService.find().then((results) => {
            this.store.dispatch(new Acl_Roles_LoadAll_Success(results))
        })

        this.backendServices.find().then((results) => {
            this.store.dispatch(new ServicesLoadAll_Success(results))
        })
    }
    /********************************************************************************************************
     * 
     *                                      Store selectors
     * 
     ********************************************************************************************************/
    getTreeNodeChildren(node) {
        return this.store.select(AclState.getTreeNodesData(node))
    }

    nodeHasChildren(node) {
        var children = this.store.selectSnapshot(AclState.getTreeNodesData(node))
        if (children.length != 0) return true
        return false
    }


    /********************************************************************************************************
     * 
     *                                          State actions
     * 
     ********************************************************************************************************/

    /**
     * 
     * @param node 
     */
    public selectNode(node: FlatTreeNode) {
        this.store.dispatch(new Acl_Select_node(node))
    }
    /**
     * Update field allowed checkbox
     * 
     * @param node 
     */
    updateFieldNode(node: AclTreeNode) {
        var datamodelEntity: DataModelPropertyEntity
        var selector = DataModelsState.getEntity(node.uid)
        datamodelEntity = this.store.selectSnapshot(selector)

        if (datamodelEntity) {
            datamodelEntity.allowed = node.checked
            this.store.dispatch(new DataModelUpdateSuccess(datamodelEntity))
        } else {
            // entity not found in store
            this.store.dispatch(new DataModelUpdateError('Entity not found'))

            // if error occured, we need to reload tree data to update node values
            // TODO: Check if we need to refresh data when error occured
        }
    }
    updateActionChecked(node: AclTreeNode): Promise<boolean> {
        var actionEntity: CrudOperationModelEntity, fieldEntities: DataModelPropertyEntity[]
        var actionSelector = CrudOperationsState.getEntity(node.uid), fieldsSelector = CrudOperationsState.getChildren(node.uid)
        var allPromises: Promise<boolean>[] = []

        actionEntity = this.store.selectSnapshot(actionSelector)
        fieldEntities = this.store.selectSnapshot(fieldsSelector)

        if (actionEntity) {
            // Update field entities
            fieldEntities.forEach((field) => {
                field.allowed = node.checked
                // Update state
                allPromises.push(this.store.dispatch(new DataModelUpdateSuccess(field)).toPromise().then(value => true))
            })
            // Update action entity
            actionEntity.allowed = node.checked
            allPromises.push(this.store.dispatch(new CrudOperations_Update_Success(actionEntity)).toPromise().then(value => true))
            Promise.all(allPromises).then(
                (values: any[]) => {
                    return true
                },
                (error: any) => {
                    return false
                })
        } else {
            allPromises.push(this.store.dispatch(new CrudOperations_Update_Error('Entity not found')).toPromise().then(value => false))
        }

        return Promise.all(allPromises).then((results: boolean[]) => {
            var isError = results.find(value => value == false)
            return (isError === undefined ? true : false)
        })
    }
    /**
     * Add a service to an existing role
     * 
     * @param roleUid 
     */
    addServiceToRole(roleUid) {
        // define a fake service
        var service: BackendServiceModel = {
            uid: uuid(),
            crud_operations: [],
            description: "new service",
            id: "fake service",
            name: "fake new service"
        }
        // first add create the new service
        this.store.dispatch(new ServicesAddServiceSuccess(service))
        this.store.dispatch(new RoleAddServiceSuccessAction(roleUid, service.uid))
    }
    aclAddRole(roleName: string) { 
        this.store.dispatch(new RolesAddRoleSuccessAction(roleName))
    }
    aclRemoveRole(roleUid:string){
        this.store.dispatch(new RolesRemoveRoleSuccessAction(roleUid))
    }

}