import { AdminPermissionsBaseEntityUtility } from "./admin.permissions.entity.utilities.base";
import { AdminPermissionsOperationEntity, AdminPermissionsFieldEntity } from "../../../models/admin.permissions.model";

/**
 * 
 */
export class Field extends AdminPermissionsBaseEntityUtility {
    field_get_parent(field: string | AdminPermissionsFieldEntity): AdminPermissionsOperationEntity {
        /** if service UID is provided, retrieve the service entity from working entities collection  */
        if (!(field instanceof AdminPermissionsFieldEntity)) field = this.entities.fields[field]

        const operation_entity = this.entities.operations[field.parentEntity.uid]
        return operation_entity
    }
    field_create_entity() { }
    field_remove_entity() { }
    field_add_field(field_uid: string | string[]) { }
    field_remove_field(field_uid: string) { }

    /**
     * 
     * @param field_entity 
     */
    field_get_children(field_entity: AdminPermissionsFieldEntity): AdminPermissionsFieldEntity[] {
        return Object.values(this.entities.fields).filter((child_field_entity) => {
            return field_entity.fields.find((child_uid) => child_uid === child_field_entity.uid)
        })
    }
}
