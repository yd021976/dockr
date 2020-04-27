import { AdminPermissionsBaseEntityUtility } from "./admin.permissions.entity.utilities.base";
import { AdminPermissionsServiceEntity,  AdminPermissionsOperationEntity, AdminPermissionsFieldEntity } from "../../../models/admin.permissions.model";

/**
 * 
 */
export class Operation extends AdminPermissionsBaseEntityUtility {
    operation_get_parent(operation: string | AdminPermissionsOperationEntity): AdminPermissionsServiceEntity {
        /** if service UID is provided, retrieve the service entity from working entities collection  */
        if (!(operation instanceof AdminPermissionsOperationEntity)) operation = this.entities.operations[operation]

        const service_entity = this.entities.services[operation.parentEntity.uid]
        return service_entity
    }
    operation_create_entity() { }
    operation_remove_entity() { }
    operation_add_field(field_uid: string | string[]) { }
    operation_remove_field(field_uid: string) { }

    /**
     * 
     * @param operation_entity 
     */
    operation_get_children(operation_entity: AdminPermissionsOperationEntity): AdminPermissionsFieldEntity[] {
        return Object.values(this.entities.fields).filter((field_entity) => {
            return operation_entity.fields.find((child_uid) => child_uid === field_entity.uid)
        })
    }
}
