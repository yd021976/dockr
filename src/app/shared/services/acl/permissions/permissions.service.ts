import { Ability, AbilityBuilder, RawRule } from '@casl/ability'
import { Injectable } from '@angular/core';
import { RoleModel } from 'src/app/shared/models/acl/roles.model';
import { CrudOperationModel, ALLOWED_STATES } from 'src/app/shared/models/acl/crud-operations.model';
import { DataModelPropertyModel } from 'src/app/shared/models/acl/datamodel.model';
import { BehaviorSubject } from 'rxjs';


export interface PermissionServiceInterface {
    ability$: BehaviorSubject<Ability>
    setAbility( roles: RoleModel[] ): Ability
    resetAbility(): Ability
    checkACL( action: string, subject: string, field: string ): boolean
}

@Injectable( {
    providedIn: 'root'
} )
export class PermissionsService implements PermissionServiceInterface {
    // Abilities change observable
    public ability$: BehaviorSubject<Ability>

    /**
     * 
     * @param ability 
     */
    constructor( private ability: Ability ) {
        this.ability$ = new BehaviorSubject<Ability>( this.ability )
        this.ability.on( 'updated', ( {rules,ability} ) => {
            this.ability$.next( ability )
        } )
    }

    /**
     * 
     * @param roles 
     */
    public setAbility( roles: RoleModel[] ): Ability {
        let rules = this.buildRulesFromRoles( roles )
        return this.ability.update( rules )
    }

    /**
     * 
     */
    public resetAbility(): Ability {
        return this.ability.update( [] )
    }

    /**
     * IMPORTANT: We need to declare this function with this form as we could pass this function as reference and loose "this"
     */
    public checkACL( action: string, subject: string, field: string ): boolean {
        return this.ability.can( action, subject, field )
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