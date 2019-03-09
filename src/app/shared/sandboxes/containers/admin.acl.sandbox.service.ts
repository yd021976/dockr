import { BaseSandboxService } from "../base-sandbox.service";
import { NotificationBaseService } from "../../services/notifications/notifications-base.service";
import { Store } from "@ngxs/store";
import { Inject } from "@angular/core";
import { AppLoggerService } from "../../services/logger/app-logger/service/app-logger.service";
import { AppLoggerServiceToken } from "../../services/logger/app-logger/app-logger-token";
import { RolesService } from "../../services/acl/roles/roles.service";
import { RolesLoadAllAction, RolesAddRoleSuccessAction, RolesLoadAllSuccessAction, RolesUpdateRoleAction, RolesUpdateRoleSuccessAction, RoleAddServiceSuccessAction } from "../../store/actions/acl/roles.actions";
import { RolesState } from "../../store/states/acl/roles.state";
import { Observable } from "rxjs";
import { RoleEntities, RoleModel } from "../../models/acl/roles.model";
// import { AclTreeDataService } from "src/app/features-modules/admin/services/acl-tree-data.service";
// import { AclFlatTreeNode } from "src/app/features-modules/admin/services/acl-flat-tree-node.model";
import { Acl_Roles_LoadAll_Success } from "../../store/actions/acl/acl.actions";
import { AclState } from "../../store/states/acl/acl.state";
import { ServicesAddServiceSuccess } from "../../store/actions/acl/backend-services.actions";
import { BackendServiceModel } from "../../models/acl/backend-services.model";
import { v4 as uuid } from 'uuid';
import { AclTreeNode } from "../../models/acl/treenode.model";
import { DataModelUpdateSuccess } from "../../store/actions/acl/datamodels.actions";
import { DataModelPropertyEntity, DataModelStateModel } from "../../models/acl/datamodel.model";
import { DataModelsState } from "../../store/states/acl/datamodels.state";

@Inject({ providedIn: 'root' })
export class AdminAclSandboxService extends BaseSandboxService {
    // public roles$: Observable<RolesNormalized>
    public roles$: Observable<RoleModel[]>
    public acltreenodes$: Observable<AclTreeNode[]>

    constructor(
        notificationService: NotificationBaseService,
        store: Store,
        @Inject(AppLoggerServiceToken) public logger: AppLoggerService,
        private rolesService: RolesService,
        // private treeDataService: AclTreeDataService
    ) {
        super(notificationService, store, logger);
        // this.roles$ = this.store.select(RolesState.roles)
        this.roles$ = this.store.select(AclState.getRoles)
        this.acltreenodes$ = this.store.select(AclState.getTreeNodesData()) // get root nodes
    }
    getTreeNodeChildren(node) {
        return this.store.select(AclState.getTreeNodesData(node))
    }
    nodeHasChildren(node) {
        var children = this.store.selectSnapshot(AclState.getTreeNodesData(node))
        if (children.length != 0) return true
        return false
    }
    updateFieldNode(node: AclTreeNode) {
        var datamodelEntity: DataModelPropertyEntity
        var selector = DataModelsState.getEntity(node.uid)
        // datamodelEntity = this.store.selectSnapshot<DataModelPropertyEntity>((state: DataModelStateModel) => {
        //     return state.entities[node.uid]
        // })
        datamodelEntity = this.store.selectSnapshot(selector)
        this.store.dispatch(new DataModelUpdateSuccess(datamodelEntity))
    }
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
    init() {
        // this.treeDataService.source$ = this.roles$
        // this.store.dispatch(new RolesLoadAllAction())
        this.rolesService.find().then((results) => {
            // this.store.dispatch(new RolesLoadAllSuccessAction(results))
            this.store.dispatch(new Acl_Roles_LoadAll_Success(results))
        })
    }
    // updateField(field: AclFlatTreeNode) {
    //     var expandednodes = this.treeDataService.treeDatasource._expandedData.value

    //     // Get root "role" node for this field
    //     var parent: AclFlatTreeNode = field, last_parent: AclFlatTreeNode = null
    //     do {
    //         last_parent = parent
    //         parent = this.treeDataService.getParentOfNode(parent)
    //     } while (parent != null)
    //     // Dispatch role update event
    //     // var role = last_parent.value as RoleModel
    //     // this.store.dispatch(new RolesUpdateRoleAction(role))
    //     // this.store.dispatch(new RolesUpdateRoleSuccessAction(role))
    // }
    // getTreeController() { return this.treeDataService.treeControl }
    // getTreeDataSource() { return this.treeDataService.treeDatasource }
}