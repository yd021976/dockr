import { AclTreeNode, NODE_TYPES } from "src/app/shared/models/acl/treenode.model";
import { createSelector, Selector } from "@ngxs/store";
import { Acl2EntitiesState } from "../entities.state/acl2.entities.state";
import { AclStateEntitiesModel, AclStateUIModel, AclEntities } from "src/app/shared/models/acl2/acl2.model";
import { entity_management } from '../utils';
import { Acl2State } from "../ui.state/acl2.state";
import { RoleEntity, RoleModel } from "src/app/shared/models/acl/roles.model";
import { FlatTreeNode } from "src/app/features-modules/admin/services/treeNodes.service";
import { ServicesState } from "../../services.state";
import { ServicesModel } from "src/app/shared/models/services.model";
import { BackendServiceEntity } from "src/app/shared/models/acl/backend-services.model";
import { CrudOperationModelEntity } from "src/app/shared/models/acl/crud-operations.model";
import { DataModelPropertyEntity } from "src/app/shared/models/acl/datamodel.model";
import { denormalize } from "normalizr";
import { AppError, errorType } from "src/app/shared/models/app-error.model";

export class AclEntitiesSelectors {
    /**
     * 
     * @param node 
     */
    static treenode_getData( node: AclTreeNode = null ): ( ...args: any ) => AclTreeNode[] {
        return createSelector( [ Acl2EntitiesState ], ( state: AclStateEntitiesModel ): AclTreeNode[] => {
            var nodes: AclTreeNode[] = []

            if ( node == null ) {
                nodes = Object.keys( state.entities.roles ).map( ( value ) => {
                    var role = state.entities.roles[ value ]
                    return {
                        uid: role.uid,
                        name: role.name,
                        type: NODE_TYPES.ROLE
                    }
                } )
            } else {
                nodes = AclEntitiesSelectors.treenode_getChildren( state, node )
            }
            return nodes
        } )

    }
    /**
     * Get children of a node
     * @param state 
     * @param node 
     */
    static treenode_getChildren( state: AclStateEntitiesModel, node: AclTreeNode ): AclTreeNode[] {
        return entity_management.treenodes.node_get_children( state, node )
    }


    /**
     * 
     * @param acl_state 
     */
    @Selector( [ Acl2State, Acl2EntitiesState ] )
    static role_get_entityFromCurrentSelectedNode( acl_state: AclStateUIModel, entities_state: AclStateEntitiesModel ): RoleEntity {
        return entity_management.treenodes.node_get_role_entity( acl_state.selectedNode, entities_state )
    }

    /**
     * Get "role" entity from any node in the tree
     * 
     * @param node Node from wich we want the role entity
     */
    static treenode_get_rootRoleEntity( node: AclTreeNode ): ( ...args: any[] ) => RoleEntity {
        return createSelector( [ Acl2EntitiesState ], ( state: AclStateEntitiesModel ): RoleEntity => {
            const flatNode: FlatTreeNode = {
                isExpandable: false,
                level: 0,
                data: JSON.parse( JSON.stringify( node ) ) // Ensure new instance of node
            }
            return entity_management.treenodes.node_get_role_entity( flatNode, state )
        } )
    }

    /**
     * Convert a role entity into a denormalized state
     * 
     * @param role_entity The role entity to denormalize
     */
    static role_get_denormalizeEntity( role_entity: RoleEntity ) {
        return createSelector( [ Acl2EntitiesState ], ( state: AclStateEntitiesModel ): RoleModel => {
            const role_model: RoleModel = Acl2EntitiesState.normalizr_utils.denormalize( role_entity.uid, Acl2EntitiesState.normalizr_utils.roleSchema, {
                roles: state.entities.roles,
                services: state.entities.services,
                crud_operations: state.entities.actions,
                fields: state.entities.fields,
            } )
            return role_model
        } )
    }

    /**
     * 
     * @param acl_entities_state 
     * @param service_state 
     */
    @Selector( [ Acl2EntitiesState, ServicesState, Acl2State ] )
    static role_get_availableServices( acl_entities_state: AclStateEntitiesModel, service_state: ServicesModel, acl_state: AclStateUIModel ) {
        const role_entity: RoleEntity = entity_management.roles.role_get_entityFromUid( acl_state.selectedNode.data.uid, acl_entities_state.entities.roles )
        return entity_management.roles.role_get_available_services( role_entity, acl_entities_state.entities.services, service_state )
    }

    /**
     * 
     * @param state 
     */
    @Selector( [ Acl2State ] )
    static treenodes_get_currentSelectedNode( state: AclStateUIModel ): FlatTreeNode {
        return state.selectedNode
    }

    /**
     * 
     * @param node 
     */
    static treenodes_get_parentNode( node: AclTreeNode ): ( ...args: any ) => AclTreeNode {
        return createSelector( [ AclEntities ], ( state: AclStateEntitiesModel ): AclTreeNode => {
            var parent: RoleEntity | BackendServiceEntity | CrudOperationModelEntity | DataModelPropertyEntity = null, parent_treeNode: AclTreeNode = null

            switch ( node.type ) {
                case NODE_TYPES.ROLE:
                    break
                case NODE_TYPES.SERVICE:
                    parent = entity_management.services.service_get_parent( node.uid, state.entities.roles )
                    parent_treeNode = {
                        name: parent._id,
                        type: NODE_TYPES.ROLE,
                        uid: parent.uid
                    }
                    break
                case NODE_TYPES.CRUDOPERATION:
                    parent = entity_management.actions.action_get_parent( node.uid, state.entities.services );
                    parent_treeNode = {
                        uid: parent.uid,
                        name: parent.id,
                        type: NODE_TYPES.SERVICE,
                    }

                    break
                // Special case : If field is a child of a field, return the parent field. Else return the parent "action"
                case NODE_TYPES.FIELDACCESS:
                    parent = entity_management.fields.field_get_parent_field( node.uid, state.entities.fields )

                    if ( parent == null ) {
                        // field is not a child of a field, get the "crud operation" parent
                        parent = entity_management.fields.field_get_parent_action( node.uid, state.entities.actions )
                        parent_treeNode = {
                            uid: parent.uid,
                            name: parent.id,
                            type: NODE_TYPES.CRUDOPERATION,
                            checked: parent.allowed
                        }
                    } else {
                        parent_treeNode = {
                            uid: parent.uid,
                            name: parent.id,
                            type: NODE_TYPES.FIELDACCESS,
                            checked: parent.allowed
                        }
                    }
                    break
                default:
                    break
            }
            return parent_treeNode
        } )
    }
    /**
     * Return roles object array (denormalized data)
     * @param state 
     */
    @Selector( [ Acl2EntitiesState ] )
    static roles_get_list( state: AclStateEntitiesModel ): RoleModel[] {
        var rolesUid = Object.keys( state.entities.roles )
        if ( rolesUid.length == 0 ) return []

        var objects = denormalize( rolesUid, Acl2EntitiesState.normalizr_utils.mainSchema, {
            roles: state.entities.roles,
            services: state.entities.services,
            crud_operations: state.entities.actions,
            fields: state.entities.fields
        } )
        return objects
    }

    /**
     * Get an entity from a UID
     * 
     * @param uid Entity uid
     * @param node_type Type of the node
     */
    static entity_get_fromUid( uid: string, node_type: NODE_TYPES ): ( ...args: any ) => RoleEntity | BackendServiceEntity | CrudOperationModelEntity | DataModelPropertyEntity {
        return createSelector( [ Acl2EntitiesState ], ( state: AclStateEntitiesModel ): RoleEntity | BackendServiceEntity | CrudOperationModelEntity | DataModelPropertyEntity => {
            let entity: RoleEntity | BackendServiceEntity | CrudOperationModelEntity | DataModelPropertyEntity = null

            switch ( node_type ) {
                case NODE_TYPES.ROLE:
                    entity = entity_management.roles.role_get_entityFromUid( uid, state.entities.roles )
                    break
                case NODE_TYPES.SERVICE:
                    entity = entity_management.services.service_get_entityFromUid( uid, state.entities.services )
                    break
                case NODE_TYPES.CRUDOPERATION:
                    entity = entity_management.actions.action_get_entityFromUid( uid, state.entities.actions )
                    break
                case NODE_TYPES.FIELDACCESS:
                    entity = entity_management.fields.field_get_entityFromUid( uid, state.entities.fields )
                    break
                default:
                    throw new AppError( 'Node type is unknown', errorType.unknown )
            }

            return entity
        } )
    }
}