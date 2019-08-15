import { createSelector, Selector } from "@ngxs/store";
import { AclEntitiesState } from "../entities.state/acl2.entities.state";
import { AclStateEntitiesModel, AclStateUIModel } from "src/app/shared/models/acl.entities.model";
import { entity_management } from '../utils';
import { AclUIState } from "../ui.state/acl2.state";
import { AclRoleEntity, AclRoleModel } from "src/app/shared/models/acl.role.model";
import { ServicesState } from "../../services.state";
import { ServicesModel } from "src/app/shared/models/services.model";
import { denormalize } from "normalizr";

export class RolesSelectors {
    /**
     * Convert a role entity into a denormalized state
     * 
     * @param role_entity The role entity to denormalize
     */
    static role_get_denormalizeEntity( role_entity: AclRoleEntity ) {
        return createSelector( [ AclEntitiesState ], ( state: AclStateEntitiesModel ): AclRoleModel => {
            const role_model: AclRoleModel = AclEntitiesState.normalizr_utils.denormalize( role_entity.uid, AclEntitiesState.normalizr_utils.roleSchema, {
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
    @Selector( [ AclEntitiesState, ServicesState, AclUIState ] )
    static role_get_availableServices( acl_entities_state: AclStateEntitiesModel, service_state: ServicesModel, acl_state: AclStateUIModel ) {
        const role_entity: AclRoleEntity = entity_management.roles.role_get_entityFromUid( acl_state.selectedNode.data.uid, acl_entities_state.entities.roles )
        return entity_management.roles.role_get_available_services( role_entity, acl_entities_state.entities.services, service_state )
    }

    /**
     * Return roles object array (denormalized data)
     * @param state 
     */
    @Selector( [ AclEntitiesState ] )
    static roles_get_list( state: AclStateEntitiesModel ): AclRoleModel[] {
        var rolesUid = Object.keys( state.entities.roles )
        if ( rolesUid.length == 0 ) return []

        var objects = denormalize( rolesUid, AclEntitiesState.normalizr_utils.mainSchema, {
            roles: state.entities.roles,
            services: state.entities.services,
            crud_operations: state.entities.actions,
            fields: state.entities.fields
        } )
        return objects
    }
}