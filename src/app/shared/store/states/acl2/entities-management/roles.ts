import { Acl2StateModel } from "src/app/shared/models/acl2/acl2.model";
import { ServicesModel } from "src/app/shared/models/services.model";
import { BackendServiceModel } from "src/app/shared/models/acl/backend-services.model";
import { RoleEntity } from "src/app/shared/models/acl/roles.model";
import { node_get_role_entity } from "./treenodes";

/**
 * 
 * @param aclState 
 * @param serviceState 
 */
export function role_get_available_services( aclState: Acl2StateModel, serviceState: ServicesModel ): BackendServiceModel[] {
    if ( aclState.selectedNode == null ) return [] // no node is selected

    var currentRoleUid: string = node_get_role_entity( aclState.selectedNode, aclState ).uid
    var availableServices: BackendServiceModel[] = []
    var roleHasServices: string

    if ( currentRoleUid != '' ) {
        availableServices = serviceState.services.filter( ( service ) => {
            roleHasServices = aclState.entities.roles[ currentRoleUid ].services.find( ( value ) => {
                if ( aclState.entities.services[ value ].id == service.id ) {
                    return true
                }
            } )
            // If service doesn't exist in role, it can be added to the role
            if ( roleHasServices == undefined ) {
                return true
            }
        } )
    }
    return availableServices
}

export function role_get_service_index( service_uid: string, role_entity: RoleEntity ) {
    return role_entity.services.findIndex( current_service_uid => {
        if ( current_service_uid === service_uid ) return true
    } )
}