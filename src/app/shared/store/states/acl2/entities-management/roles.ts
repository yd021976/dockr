import { Acl2StateModel } from "src/app/shared/models/acl2/acl2.model";
import { ServicesModel } from "src/app/shared/models/services.model";
import { BackendServiceModel, BackendServicesEntities } from "src/app/shared/models/acl/backend-services.model";
import { RoleEntity, RoleEntities } from "src/app/shared/models/acl/roles.model";

/**
 * 
 * @param aclState 
 * @param serviceState 
 */
export function role_get_available_services( role_entity: RoleEntity, services_entities: BackendServicesEntities, serviceState: ServicesModel ): BackendServiceModel[] {
    if ( role_entity == null ) return [] //return empty array if no role provided

    // var currentRoleUid: string = node_get_role_entity( aclState.selectedNode, aclState ).uid
    var availableServices: BackendServiceModel[] = []
    var roleHasServices: string

    availableServices = serviceState.services.filter( ( service ) => {
        roleHasServices = role_entity.services.find( ( value ) => {
            if ( services_entities[ value ].id == service.id ) {
                return true
            }
        } )
        // If service doesn't exist in role, it can be added to the role
        if ( roleHasServices == undefined ) {
            return true
        }
    } )
    return availableServices
}

/**
 * Get service uid array index in role entity
 * 
 * @param service_uid 
 * @param role_entity 
 */
export function role_get_service_index( service_uid: string, role_entity: RoleEntity ) {
    return role_entity.services.findIndex( current_service_uid => {
        if ( current_service_uid === service_uid ) return true
    } )
}

export function role_get_entityFromUid( role_uid: string, role_entities: RoleEntities ): RoleEntity {
    const role_entity = role_entities[ role_uid ] || null
    return role_entity
}