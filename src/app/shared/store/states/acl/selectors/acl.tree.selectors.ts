import { createSelector, Selector } from "@ngxs/store";
import { AclTreeNode, NODE_TYPES, FlatTreeNode } from "../../../../../shared/models/treenode.model";
import { AclEntitiesState } from "../entities.state/acl2.entities.state";
import { AclStateEntitiesModel, AclStateUIModel, AclEntities } from "../../../../models/acl.entities.model";
import { entity_management } from '../utils';
import { AclRoleEntity, AclRoleModel } from "../../../../models/acl.role.model";
import { AclServiceEntity } from "../../../../models/acl.services.model";
import { AclServiceActionModelEntity } from "../../../../models/acl.service.action.model";
import { ServiceFieldEntity } from "../../../../models/acl.service.field.model";

export class AclTreeSelectors {
    /**
     * 
     * @param node 
     */
    static treenode_getData( node: AclTreeNode = null ): ( ...args: any ) => AclTreeNode[] {
        return createSelector( [ AclEntitiesState ], ( state: AclStateEntitiesModel ): AclTreeNode[] => {
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
                nodes = AclTreeSelectors.treenode_getChildren( state, node )
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
    * Get "role" entity from any node in the tree
    * 
    * @param node Node from wich we want the role entity
    */
    static treenode_get_rootRoleEntity( node: AclTreeNode ): ( ...args: any[] ) => AclRoleEntity {
        return createSelector( [ AclEntitiesState ], ( state: AclStateEntitiesModel ): AclRoleEntity => {
            const flatNode: FlatTreeNode = {
                isExpandable: false,
                level: 0,
                data: JSON.parse( JSON.stringify( node ) ) // Ensure new instance of node
            }
            return entity_management.treenodes.node_get_role_entity( flatNode, state )
        } )
    }

    /**
     * 
     * @param node 
     */
    static treenodes_get_parentNode( node: AclTreeNode ): ( ...args: any ) => AclTreeNode {
        return createSelector( [ AclEntities ], ( state: AclStateEntitiesModel ): AclTreeNode => {
            var parent: AclRoleEntity | AclServiceEntity | AclServiceActionModelEntity | ServiceFieldEntity = null, parent_treeNode: AclTreeNode = null

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
}