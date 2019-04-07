import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";
import { AclStateModel } from "src/app/shared/models/acl/acl.model";
import { RoleEntity } from "src/app/shared/models/acl/roles.model";
import { BackendServiceEntity } from "src/app/shared/models/acl/backend-services.model";
import { CrudOperationModelEntity } from "src/app/shared/models/acl/crud-operations.model";
import { NODE_TYPES } from "src/app/shared/models/acl/treenode.model";

export function node_getRoleEntity(node: FlatTreeNode, state: AclStateModel): RoleEntity {
    var roleEntity: RoleEntity = null
    var serviceEntity: BackendServiceEntity = null
    var crudEntity: CrudOperationModelEntity = null

    // If no node is selected, return null
    if (node == null) return null

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
export function service_getParent(service_uid: string, state: AclStateModel): RoleEntity {
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
export function crud_getParent(crud_uid: string, state: AclStateModel): BackendServiceEntity {
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
export function field_getParent(field_uid: string, state: AclStateModel): CrudOperationModelEntity {
    var crudEntity: CrudOperationModelEntity = null
    Object.keys(state.crudOperations.entities).map((crudUID) => {
        if (state.crudOperations.entities[crudUID].fields.find((fieldUID) => fieldUID == field_uid)) {
            crudEntity = state.crudOperations.entities[crudUID]
        }
    })
    return crudEntity
}
