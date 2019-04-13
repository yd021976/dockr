import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";
import { RoleEntity } from "src/app/shared/models/acl/roles.model";
import { BackendServiceEntity, BackendServiceModel } from "src/app/shared/models/acl/backend-services.model";
import { CrudOperationModelEntity } from "src/app/shared/models/acl/crud-operations.model";
import { NODE_TYPES, AclTreeNode } from "src/app/shared/models/acl/treenode.model";
import { ServicesModel } from "src/app/shared/models/services.model";
import { Acl2StateModel } from "src/app/shared/models/acl2/acl2.model";

export function node_getRoleEntity(node: FlatTreeNode, state: Acl2StateModel): RoleEntity {
    var roleEntity: RoleEntity = null
    var serviceEntity: BackendServiceEntity = null
    var crudEntity: CrudOperationModelEntity = null

    // If no node is selected, return null
    if (node == null) return null

    switch (node.data.type) {
        case NODE_TYPES.ROLE:
            roleEntity = state.entities.roles[node.data.uid]
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
export function service_getParent(service_uid: string, state: Acl2StateModel): RoleEntity {
    var parentEntity: RoleEntity = null

    Object.keys(state.entities.roles.entities).map((uid) => {
        if (state.entities.roles[uid].services.find((serviceUID) => serviceUID == service_uid)) {
            parentEntity = state.entities.roles[uid]
        }
    })
    return parentEntity
}

/**
 * Get Service entity from crud operation UID
 * @param crud_uid 
 * @param state 
 */
export function crud_getParent(crud_uid: string, state: Acl2StateModel): BackendServiceEntity {
    var serviceEntity: BackendServiceEntity = null

    Object.keys(state.entities.services).map((serviceUID) => {
        if (state.entities.services[serviceUID].crud_operations.find((crudUID) => crudUID == crud_uid)) {
            serviceEntity = state.entities.services[serviceUID]
        }
    })
    return serviceEntity
}

/**
 * Get crud operation entity from field UID
 * @param field_uid 
 * @param state 
 */
export function field_getParent(field_uid: string, state: Acl2StateModel): CrudOperationModelEntity {
    var crudEntity: CrudOperationModelEntity = null
    Object.keys(state.entities.actions).map((crudUID) => {
        if (state.entities.actions[crudUID].fields.find((fieldUID) => fieldUID == field_uid)) {
            crudEntity = state.entities.actions[crudUID]
        }
    })
    return crudEntity
}

export function getTreeNodeChildren(state: Acl2StateModel, node: AclTreeNode): AclTreeNode[] {
    var children: AclTreeNode[] = []

    switch (node.type) {
        case NODE_TYPES.ROLE:
            var roleServices = state.entities.roles[node.uid].services
            children = roleServices.map((key) => {
                var service = state.entities.services[key]
                return {
                    uid: service.uid,
                    type: NODE_TYPES.SERVICE,
                    name: service.name
                }
            })
            break
        case NODE_TYPES.SERVICE:
            var serviceCrudOperations = state.entities.services[node.uid].crud_operations
            children = serviceCrudOperations.map((key) => {
                var crud = state.entities.actions[key]
                return {
                    uid: crud.uid,
                    name: crud.id,
                    checked: crud.allowed,
                    type: NODE_TYPES.CRUDOPERATION
                }
            })
            break
        case NODE_TYPES.CRUDOPERATION:
            var fields = state.entities.actions[node.uid].fields
            children = fields.map((key) => {
                var field = state.entities.fields[key]
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

export function availableRoleServices(aclState: Acl2StateModel, serviceState: ServicesModel): BackendServiceModel[] {
    if (aclState.selectedNode == null) return [] // no node is selected

    var currentRoleUid: string = node_getRoleEntity(aclState.selectedNode,aclState).uid
    var availableServices: BackendServiceModel[] = []
    var roleHasServices: string

    if (currentRoleUid != '') {
        availableServices = serviceState.services.filter((service) => {
            roleHasServices = aclState.entities.roles[currentRoleUid].services.find((value) => {
                if (aclState.entities.services[value].id == service.id) {
                    return true
                }
            })
            // If service doesn't exist in role, it can be added to the role
            if (roleHasServices == undefined) {
                return true
            }
        })
    }
    return availableServices
}
