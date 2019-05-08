import { NODE_TYPES, AclTreeNode } from "src/app/shared/models/acl/treenode.model";
import { RoleEntity } from "src/app/shared/models/acl/roles.model";
import { BackendServiceEntity } from "src/app/shared/models/acl/backend-services.model";
import { CrudOperationModelEntity } from "src/app/shared/models/acl/crud-operations.model";
import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";
import { Acl2StateModel } from "src/app/shared/models/acl2/acl2.model";
import { DataModelPropertyEntity } from "src/app/shared/models/acl/datamodel.model";

export function get_treenode_children( state: Acl2StateModel, node: AclTreeNode ): AclTreeNode[] {
    var children: AclTreeNode[] = []

    switch ( node.type ) {
        case NODE_TYPES.ROLE:
            var roleServices = state.entities.roles[ node.uid ].services
            children = roleServices.map( ( key ) => {
                var service = state.entities.services[ key ]
                return {
                    uid: service.uid,
                    type: NODE_TYPES.SERVICE,
                    name: service.name
                }
            } )
            break
        case NODE_TYPES.SERVICE:
            var serviceCrudOperations = state.entities.services[ node.uid ].crud_operations
            children = serviceCrudOperations.map( ( key ) => {
                var crud = state.entities.actions[ key ]
                return {
                    uid: crud.uid,
                    name: crud.id,
                    checked: crud.allowed,
                    type: NODE_TYPES.CRUDOPERATION
                }
            } )
            break
        case NODE_TYPES.CRUDOPERATION:
            var fields = state.entities.actions[ node.uid ].fields || []
            children = fields.map( ( key ) => {
                var field = state.entities.fields[ key ]
                return {
                    uid: field.uid,
                    name: field.id,
                    checked: field.allowed,
                    type: NODE_TYPES.FIELDACCESS
                }
            } )
            break
        case NODE_TYPES.FIELDACCESS:
            var field_children = state.entities.fields[ node.uid ].children || []
            var field_entity: DataModelPropertyEntity

            children = Object.values( field_children ).map( entity_uid => {
                field_entity = state.entities.fields[ entity_uid ]
                return {
                    uid: field_entity.uid,
                    name: field_entity.id,
                    checked: field_entity.allowed,
                    type: NODE_TYPES.FIELDACCESS
                }
            } )
            break
        default:
            break
    }
    return children
}
export function node_get_role_entity( node: FlatTreeNode, state: Acl2StateModel ): RoleEntity {
    var roleEntity: RoleEntity = null
    var serviceEntity: BackendServiceEntity = null
    var crudEntity: CrudOperationModelEntity = null

    // If no node is selected, return null
    if ( node == null ) return null

    switch ( node.data.type ) {
        case NODE_TYPES.ROLE:
            roleEntity = state.entities.roles[ node.data.uid ]
            break
        case NODE_TYPES.SERVICE:
            roleEntity = this.service_getParent( node.data.uid, state )
            break
        case NODE_TYPES.CRUDOPERATION:
            serviceEntity = this.crud_getParent( node.data.uid, state )
            if ( serviceEntity !== null ) {
                roleEntity = this.service_getParent( serviceEntity.uid, state )
            }
            break
        case NODE_TYPES.FIELDACCESS:
            crudEntity = this.field_getParent( node.data.uid, state )
            if ( crudEntity !== null ) {
                serviceEntity = this.crud_getParent( crudEntity.uid, state )
                if ( serviceEntity !== null ) {
                    roleEntity = this.service_getParent( serviceEntity.uid, state )
                }
            }
            break
    }
    return roleEntity
}