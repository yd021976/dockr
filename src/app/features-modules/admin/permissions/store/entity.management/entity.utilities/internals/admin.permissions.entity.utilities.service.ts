import { AdminPermissionsBaseEntityUtility } from "./admin.permissions.entity.utilities.base";
import { AdminPermissionsServiceEntity, AdminPermissionsRoleEntity, AdminPermissionsOperationEntity } from "../../../models/admin.permissions.model";

/**
 * 
 */
export class Service extends AdminPermissionsBaseEntityUtility {
    service_get_parent(service: string | AdminPermissionsServiceEntity): AdminPermissionsRoleEntity {
        /** if service UID is provided, retrieve the service entity from working entities collection  */
        if (!(service instanceof AdminPermissionsServiceEntity)) service = this.entities.services[service]

        const role_entity = this.entities.roles[service.parentEntity.uid]
        return role_entity
    }
    service_create_entity() { }
    service_remove_entity() { }
    service_add_operation(operation_uid: string | string[]) { }
    service_remove_operation(operation_uid: string) { }

    /**
     * 
     * @param service_entity 
     */
    service_get_children(service_entity: AdminPermissionsServiceEntity): AdminPermissionsOperationEntity[] {
        return Object.values(this.entities.operations).filter((operation_entity) => {
            return service_entity.operations.find((child_uid) => child_uid === operation_entity.uid)
        })
    }
}
