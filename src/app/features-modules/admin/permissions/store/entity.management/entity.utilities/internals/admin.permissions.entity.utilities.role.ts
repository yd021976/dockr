import { AdminPermissionsBaseEntityUtility } from "./admin.permissions.entity.utilities.base";
import { AdminPermissionsRoleEntity, ENTITY_TYPES, AdminPermissionsEntitiesTypes, AdminPermissionsRoleEntities } from "../../../models/admin.permissions.model";
import { v4 as uuid } from 'uuid';

/**
 * 
 */
export class Role extends AdminPermissionsBaseEntityUtility {
    /** Create a new role entity with empty services children */
    role_create_entity(name: string, uid: string = null): AdminPermissionsRoleEntities {
        let entity = new AdminPermissionsRoleEntity()
        entity.entity_type = ENTITY_TYPES.ROLE
        entity.parentEntity = { childrenKey: '', entitiesKey: '', type: '', uid: '' }
        entity.children_key = 'services'
        entity.entitiesKey = 'roles'
        entity.id = name
        entity.uid = uid === null ? uuid() : uid
        entity.services = []
        entity.name = name
        entity.allowed = null
        return {[entity.uid]:entity}
    }
    role_remove_entity() { }
    role_add_service() { }
    role_remove_service() { }
    role_get_children() { }
}
