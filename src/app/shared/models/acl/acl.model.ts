import { RolesStateModel } from "./roles.model";
import { BackendServicesStateModel } from "./backend-services.model";
import { CrudOperationsStateModel } from "./crud-operations.model";
import { DataModelStateModel } from "./datamodel.model";

export class AclStateModel {
    roles: RolesStateModel;
    backendServices: BackendServicesStateModel;
    crudOperations: CrudOperationsStateModel;
    datamodels: DataModelStateModel;
}