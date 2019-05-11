import { DataModelPropertyEntities, DataModelPropertyEntity } from "src/app/shared/models/acl/datamodel.model";
import { CrudOperationModelEntity, CrudOperationsModelEntities, ALLOWED_STATES } from "src/app/shared/models/acl/crud-operations.model";


/**
 * Remove field entity all of its children from state
 * 
 * @param field_uid 
 * @param field_entities 
 */
export function field_remove_entity( field_uid: string, field_entities: DataModelPropertyEntities ) {
    var field_entity: DataModelPropertyEntity = field_entities[ field_uid ]

    // Recursively remove children field if any
    if ( field_entity.fields ) {
        field_entity.fields.forEach( current_field_uid => {
            field_remove_entity( current_field_uid, field_entities )
        } )
    }

    // remove field from state
    delete field_entities[ field_uid ]
}

/**
 * Get crud operation entity from field UID
 * @param field_uid 
 * @param field_entities 
 */
export function field_get_parent_action( field_uid: string, actions_entities: CrudOperationsModelEntities ): CrudOperationModelEntity {
    var crudEntity: CrudOperationModelEntity = null
    Object.keys( actions_entities ).map( ( crudUID ) => {
        if ( actions_entities[ crudUID ].fields.find( ( fieldUID ) => fieldUID == field_uid ) ) {
            crudEntity = actions_entities[ crudUID ]
        }
    } )
    return crudEntity
}

/**
 * 
 * @param field_uid 
 * @param field_entities 
 */
export function field_get_parent_field( field_uid: string, field_entities: DataModelPropertyEntities ): DataModelPropertyEntity {
    var fieldEntity: DataModelPropertyEntity = null

    // Check if field is children of a field
    var is_field_child = Object.values( field_entities ).find( field_entity => {
        if ( field_entity.fields && field_entity.fields.find( child_uid => child_uid == field_uid ) ) {
            fieldEntity = field_entity
            return true
        }
    } )
    return fieldEntity
}

/**
 * Update field "allowed" property recursively for all its children
 * 
 * @param field_uid the field UID
 * @param allowed Property value to update
 * @param field_entities State containing entities
 */
function field_update_descendants( field_uid: string, field_entities: DataModelPropertyEntities ) {
    var field_entity = field_entities[ field_uid ]

    // When allowed is "indeterminate" we just can't compute descendants allowed property has it means : Some descendants are allowed, some others are forbidden
    if ( field_entity.allowed == ALLOWED_STATES.INDETERMINATE ) return // Do nothing

    if ( !field_entity.fields ) return // No children, do nothing

    // The field entity from uid should already have the "allowed" property up to date
    field_entities[ field_uid ].fields.map( child_uid => {
        field_entities[ child_uid ].allowed = field_entity.allowed
        // Update children if any
        field_update_descendants( child_uid, field_entities )
    } )
}

/**
 * Compute allowed property for a given field. This function will NOT update allowed state
 * 
 * If field has no children, return current allowed state.
 * If field has children, compute allowed state depending children allowed state
 * 
 * @param field_uid Filed UID to compute allowed state
 * @param field_entities State containing entities
 */
function field_compute_allowed_state( field_uid: string, field_entities: DataModelPropertyEntities ): ALLOWED_STATES {
    var field_entity: DataModelPropertyEntity = field_entities[ field_uid ]
    var allowed_state: ALLOWED_STATES = ALLOWED_STATES.INDETERMINATE // Default allowed state is indeterminate

    // If field has no children, return field allowed state
    if ( !field_entity.fields ) return field_entity.allowed

    /**
     * If field has descendants, compute field allowed state
     */
    var allowed_children = [] = field_entity.fields.filter( child_uid => {
        return field_entities[ child_uid ].allowed == ALLOWED_STATES.ALLOWED
    } )
    var indeterminate_children = [] = field_entity.fields.filter( child_uid => {
        return field_entities[ child_uid ].allowed == ALLOWED_STATES.INDETERMINATE
    } )
    // Compute allowed state
    if ( allowed_children.length == field_entity.fields.length ) allowed_state = ALLOWED_STATES.ALLOWED
    if ( allowed_children.length == 0 && indeterminate_children.length == 0 ) allowed_state = ALLOWED_STATES.FORBIDDEN
    if ( indeterminate_children.length != 0 ) allowed_state = ALLOWED_STATES.INDETERMINATE

    return allowed_state
}
/**
 * Update field "allowed" property. Update all children if any exists
 * 
 * @param field_uid the field UID
 * @param allowed Property value to update
 * @param field_entities State containing entities
 */
export function field_update_allowed( field_uid: string, allowed: ALLOWED_STATES, field_entities: DataModelPropertyEntities ) {
    var field_entity: DataModelPropertyEntity = field_entities[ field_uid ]
    var parent_field_entity: DataModelPropertyEntity
    var computed_allowed: ALLOWED_STATES

    // Update field entity
    field_entity.allowed = allowed

    // update descendants fields in hierarchy if any
    field_update_descendants( field_uid, field_entities )

    // Update parents recursively
    parent_field_entity = field_entity
    while ( parent_field_entity = field_get_parent_field( parent_field_entity.uid, field_entities ) ) {
        computed_allowed = field_compute_allowed_state( parent_field_entity.uid, field_entities )
        parent_field_entity.allowed = computed_allowed
    }
}

/**
 * Get the root field from a field in hierarchy
 * 
 * @param field_uid Field UID
 * @param field_entities State containing entities
 */
export function field_get_root_field( field_uid: string, field_entities: DataModelPropertyEntities ): DataModelPropertyEntity {
    var parent_field_entity: DataModelPropertyEntity
    var parent_field_uid: string

    parent_field_uid = field_uid
    parent_field_entity = field_entities[ field_uid ]
    while ( parent_field_entity = field_get_parent_field( parent_field_uid, field_entities ) ) {
        parent_field_uid = parent_field_entity.uid
    }
    return field_entities[ parent_field_uid ]
}
