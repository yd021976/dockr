import { NODE_TYPES } from "src/app/shared/models/treenode.model";
import { createSelector } from "@ngxs/store";
import { AclEntitiesState } from "../entities.state/acl2.entities.state";
import { AclStateEntitiesModel } from "src/app/shared/models/acl.entities.model";
import { entity_management } from '../utils';
import { AclRoleEntity } from "src/app/shared/models/acl.role.model";
import { AclServiceEntity } from "src/app/shared/models/acl.services.model";
import { AclServiceActionModelEntity } from "src/app/shared/models/acl.service.action.model";
import { ServiceFieldEntity } from "src/app/shared/models/acl.service.field.model";
import { AppError, errorType } from "src/app/shared/models/application.error.model";

export class AclEntitiesSelectors {
    /**
     * Get an entity from a UID
     * 
     * @param uid Entity uid
     * @param node_type Type of the node
     */
    static entity_get_fromUid( uid: string, node_type: NODE_TYPES ): ( ...args: any ) => AclRoleEntity | AclServiceEntity | AclServiceActionModelEntity | ServiceFieldEntity {
        return createSelector( [ AclEntitiesState ], ( state: AclStateEntitiesModel ): AclRoleEntity | AclServiceEntity | AclServiceActionModelEntity | ServiceFieldEntity => {
            let entity: AclRoleEntity | AclServiceEntity | AclServiceActionModelEntity | ServiceFieldEntity = null

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