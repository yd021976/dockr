import { Ability, AbilityBuilder, RawRule } from '@casl/ability'
import { Injectable } from '@angular/core';
import { RoleModel } from 'src/app/shared/models/acl/roles.model';
import { CrudOperationModel, ALLOWED_STATES } from 'src/app/shared/models/acl/crud-operations.model';
import { DataModelPropertyModel } from 'src/app/shared/models/acl/datamodel.model';

@Injectable( {
    providedIn: 'root'
} )
export class PermissionsService {
    constructor( private ability: Ability ) { }
    setAbility( roles: RoleModel[] ): Ability {
        let rules = this.buildRulesFromRoles( roles )
        return this.ability.update( rules )
    }
    resetAbility(): Ability {
        return this.ability.update( [] )
    }

    private buildRulesFromRoles( roles: RoleModel[] ): RawRule[] {
        let rawRules = [], tmpRule: RawRule
        let subject: string, action: string, fields: string[]

        roles.forEach( ( role: RoleModel ) => {
            role.services.forEach( ( service ) => {
                subject = service.name

                // For each "action" add permitted fields
                service.crud_operations
                    .filter( operation => operation.allowed == ALLOWED_STATES.ALLOWED || operation.allowed == ALLOWED_STATES.INDETERMINATE ) // do not include "FORBIDDEN" actions
                    .forEach( ( crud_operation ) => {
                        action = crud_operation.id
                        tmpRule = { subject: subject, actions: action }

                        // if no field, assume all fields are granted (value '*')
                        if ( !crud_operation.fields || crud_operation.fields.length == 0 ) {
                            tmpRule.fields = [ '*' ]
                        } else {
                            // Get granted field in path form (i.e. object.prop1.prop2)
                            fields = this.getFieldsFromAction( crud_operation )
                            tmpRule.fields = fields
                        }

                        // Add this rule
                        rawRules.push( tmpRule )
                    } )

            } )
        } )
        return rawRules
    }
    private getFieldsFromAction( action: CrudOperationModel ): string[] {
        let fields: string[] = [], tmpFields: string[]
        action.fields.forEach( ( field ) => {
            tmpFields = this.getFields( field )
            fields.push( ...tmpFields )
        } )
        return fields
    }

    /**
     * 
     * @param field 
     * @param current_field_path 
     */
    private getFields( field: DataModelPropertyModel, current_field_path?: string ): string[] {
        let fields: string[] = []
        let tmpFields: string[]

        current_field_path = current_field_path ? current_field_path : field.id

        if ( field.allowed == ALLOWED_STATES.ALLOWED ) fields.push( current_field_path )

        if ( field.fields ) {
            field.fields.forEach( tmpField => {
                tmpFields = this.getFields( tmpField, current_field_path + '.' + tmpField.id )
                fields.push( ...tmpFields )
            } )
        }

        return fields
    }
}