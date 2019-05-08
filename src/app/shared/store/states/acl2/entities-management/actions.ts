import { CrudOperationModelEntity, CrudOperationsModelEntities } from "src/app/shared/models/acl/crud-operations.model";
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