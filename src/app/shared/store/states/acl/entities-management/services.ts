import { AclRoleEntity, AclRoleEntities } from "src/app/shared/models/acl.role.model";
import { action_remove_entity } from './actions'
import { BackendServicesEntities, AclServiceEntity } from "src/app/shared/models/acl.services.model";
import { AclServiceActionModelEntities, AclServiceActionModelEntity } from "src/app/shared/models/acl.service.action.model";
import { ServiceFieldEntities } from "src/app/shared/models/acl.service.field.model";
import { role_get_service_index } from "./roles";
/**
 * Get role entity from service UID
 * @param service_uid 
 * @param role_entities 
 */
export function service_get_parent( service_uid: string, role_entities: AclRoleEntities ): AclRoleEntity {
    var parentEntity: AclRoleEntity = null

    Object.keys( role_entities ).map( ( uid ) => {
        if ( role_entities[ uid ].services.find( ( serviceUID ) => serviceUID == service_uid ) ) {
            parentEntity = role_entities[ uid ]
        }
    } )
    return parentEntity
}


export function service_get_entityFromUid( entity_uid: string, service_entities: BackendServicesEntities ):AclServiceEntity {
    const service_entity = service_entities[ entity_uid ] || null
    return service_entity
}
/**
 * Remove a service entity from state
 * 
 * @param service_uid The service UID to remove
 * @param roles_entities Role entities from state
 * @param service_entities Services entities from state
 */
export function service_remove_entity(
    service_uid: string,
    role_entities: AclRoleEntities,
    service_entities: BackendServicesEntities,
    action_entities: AclServiceActionModelEntities,
    field_entities: ServiceFieldEntities ) {

    // Get role entity this service belong to.
    // IMPORTANT: Throws error if no role is found
    var role_entity = service_get_parent( service_uid, role_entities )
    if ( role_entity === null ) {
        throw new Error( '[service_remove_entity] Service <' + service_uid + '> has no associated role in state' )
    }

    // get service index in role services list
    var service_index = role_get_service_index( service_uid, role_entity )

    // Remove all service action and fields
    var service_entity = service_entities[ service_uid ]
    service_entity.operations.forEach( action_uid => {
        action_remove_entity( action_uid, action_entities, field_entities ) // Will remove all fields that belong to this action if any exist
    } )

    // Remove service from state
    delete service_entities[ service_uid ]

    // Remove service reference in role entity
    role_entity.services.splice( service_index, 1 )
}
