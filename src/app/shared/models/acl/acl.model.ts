import { RolesStateModel, RoleEntity } from "./roles.model";
import { BackendServicesStateModel } from "./backend-services.model";
import { CrudOperationsStateModel } from "./crud-operations.model";
import { DataModelStateModel } from "./datamodel.model";
import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";

export class AclStateModel {
    roles: RolesStateModel;
    aclServices: BackendServicesStateModel;
    crudOperations: CrudOperationsStateModel;
    datamodels: DataModelStateModel;
    currentSelectedNode:FlatTreeNode; // current selected node in the tree
    currentSelectedNode_RoleEntity:RoleEntity // current root node (level 0) of <currentSelectedNode>
}