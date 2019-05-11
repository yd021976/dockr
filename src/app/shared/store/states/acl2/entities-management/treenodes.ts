import { NODE_TYPES, AclTreeNode } from "src/app/shared/models/acl/treenode.model";
import { RoleEntity } from "src/app/shared/models/acl/roles.model";
import { BackendServiceEntity } from "src/app/shared/models/acl/backend-services.model";
import { CrudOperationModelEntity } from "src/app/shared/models/acl/crud-operations.model";
import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";
import { Acl2StateModel } from "src/app/shared/models/acl2/acl2.model";
import { DataModelPropertyEntity } from "src/app/shared/models/acl/datamodel.model";
import { service_get_parent } from "./services";
import { action_get_parent } from "./actions";
import { field_get_root_field, field_get_parent_action } from "./fields";

export function node_get_children( state: Acl2StateModel, node: AclTreeNode ): AclTreeNode[] {
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
            var field_children = state.entities.fields[ node.uid ].fields || []
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

/**
 * Get root "role" type node from any node in the tree
 * 
 * @param node The node UID from wich we want to get root "role" node
 * @param state State entities
 */
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
            roleEntity = service_get_parent( node.data.uid, state.entities[ 'roles' ] )
            break
        case NODE_TYPES.CRUDOPERATION:
            serviceEntity = action_get_parent( node.data.uid, state.entities[ 'services' ] )
            if ( serviceEntity !== null ) {
                roleEntity = service_get_parent( serviceEntity.uid, state.entities[ 'roles' ] )
            }
            break
        case NODE_TYPES.FIELDACCESS:
            // Get the root field if field is child of another field
            const field_root = field_get_root_field( node.data.uid, state.entities[ 'fields' ] )
            
            // Get parent action entity
            crudEntity = field_get_parent_action( field_root.uid, state.entities[ 'actions' ] )

            if ( crudEntity !== null ) {
                // Get parent service entity
                serviceEntity = action_get_parent( crudEntity.uid, state.entities[ 'services' ] )
                if ( serviceEntity !== null ) {
                    // Get parent role entity
                    roleEntity = service_get_parent( serviceEntity.uid, state.entities[ 'roles' ] )
                }
            }
            break
    }
    return roleEntity
}