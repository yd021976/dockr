import { CrudOperationModelEntity, CrudOperationsModelEntities, ALLOWED_STATES } from "src/app/shared/models/acl/crud-operations.model";
import { DataModelPropertyEntities } from "src/app/shared/models/acl/datamodel.model";
import { field_remove_entity } from "./fields";
import { BackendServicesEntities, BackendServiceEntity } from "src/app/shared/models/acl/backend-services.model";


/**
 * 
 * @param action_uid 
 * @param action_entities 
 * @param field_entities 
 */
export function action_remove_entity( action_uid: string, action_entities: CrudOperationsModelEntities, field_entities: DataModelPropertyEntities ) {
    var action_entity: CrudOperationModelEntity = action_entities[ action_uid ]
    // Remove each field if any
    if ( action_entity[ 'fields' ] ) {
        action_entity.fields.forEach( field_uid => {
            field_remove_entity( field_uid, field_entities )
        } )
    }

    // Remove action id from state
    delete action_entities[ action_uid ]
}

/**
 * Get Service entity from crud operation UID
 * @param crud_uid 
 * @param services_entities 
 */
export function action_get_parent( crud_uid: string, services_entities: BackendServicesEntities ): BackendServiceEntity {
    var serviceEntity: BackendServiceEntity = null

    Object.keys( services_entities ).map( ( serviceUID ) => {
        if ( services_entities[ serviceUID ].crud_operations.find( ( crudUID ) => crudUID == crud_uid ) ) {
            serviceEntity = services_entities[ serviceUID ]
        }
    } )
    return serviceEntity
}

/**
 * Update allowed property depending action fields allowed state
 * IMPORTANT: Will mutate the <action_entities> parameter
 * 
 * @param action_uid 
 * @param action_entities 
 * @param fields_entities 
 */
export function action_update_allowed( action_uid: string, action_entities: CrudOperationsModelEntities, fields_entities: DataModelPropertyEntities ) {
    let action_entity = action_entities[ action_uid ]
    // Update action entity
    const allowedFields = action_entity.fields.filter( ( field_uid ) => {
        return fields_entities[ field_uid ].allowed === ALLOWED_STATES.ALLOWED
    } )
    const indeterminateFields = action_entity.fields.filter( ( field_uid ) => {
        return fields_entities[ field_uid ].allowed === ALLOWED_STATES.INDETERMINATE
    } )

    // If all fields for the parent action are "allowed" => Action is "allowed"
    if ( allowedFields.length == action_entity.fields.length ) {
        action_entity.allowed = ALLOWED_STATES.ALLOWED
    }
    // No field allowed and no field indeterminate => Action is not allowed
    else if ( allowedFields.length == 0 && indeterminateFields.length == 0 ) {
        action_entity.allowed = ALLOWED_STATES.FORBIDDEN
    }
    // allowed field state is indeterminate => Action is "intermediate"
    else {
        action_entity.allowed = ALLOWED_STATES.INDETERMINATE
    }
}