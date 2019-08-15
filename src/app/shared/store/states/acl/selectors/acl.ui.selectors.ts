import { AclUIState } from "../ui.state/acl2.state";
import { AclStateUIModel } from "../../../../models/acl.entities.model";
import { FlatTreeNode } from "../../../../../features-modules/admin/services/treeNodes.service";
import { Selector } from "@ngxs/store";
import { AclEntitiesState } from "../entities.state/acl2.entities.state";
import { AclStateEntitiesModel } from "src/app/shared/models/acl.entities.model";
import { entity_management } from '../utils';
import { AclRoleEntity } from "src/app/shared/models/acl.role.model";


/**
 * 
 */
export class AclUISelectors {
    /**
     * 
     * @param state
     */
    @Selector( [ AclUIState ] )
    static treenodes_get_currentSelectedNode( state: AclStateUIModel ): FlatTreeNode {
        return state.selectedNode
    }

    /**
     * 
     * @param acl_state 
     */
    @Selector( [ AclUIState, AclEntitiesState ] )
    static role_get_entityFromCurrentSelectedNode( acl_state: AclStateUIModel, entities_state: AclStateEntitiesModel ): AclRoleEntity {
        return entity_management.treenodes.node_get_role_entity( acl_state.selectedNode, entities_state )
    }
}