import { Component, OnInit, Input, TemplateRef, Renderer2 } from '@angular/core';
import { NgxPermissionsService, NgxRolesService, NgxPermissionsConfigurationService } from 'ngx-permissions';
import { Ability, AbilityBuilder, RawRule } from '@casl/ability'
import { permittedFieldsOf } from '@casl/ability/extra'
import * as flatnest from 'flatnest'

export type htmlElementChanges = {
  method: string,
  attribute: string,
  attributeValue: string
}

type foobarType = { foobar: string }
type fooType = {

  foo: {
    bar: foobarType[]
  }
}
class Dashboard {
  public static modelName: string = 'dashboard'
  data: fooType

  constructor( data: fooType ) {
    this.data = data
  }
}

@Component( {
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
} )
export class DashboardComponent implements OnInit {
  public readonly read_dashboard: string = "read_dashboard";
  private currentPermissionAuthorized: string;
  public isAuthorized: Function
  private permissions: RawRule[]

  @Input() data; // TODO: set data type for dashboard component
  constructor( private permissionsService: NgxPermissionsService, private rolesService: NgxRolesService ) {
    this.permissions = this.initPermissions()
    let ability = new Ability()
    ability.update( this.permissions )

    // Just quick testing
    var data = new Dashboard( { foo: { bar: [ { foobar: 'toto1' }, { foobar: 'toto2' } ] } } )
    var f = flatnest.flatten( data ) // WARN: Doesn't work if some properties use . or [] in their name
    var property, cleanPropPath, isGranted

    for ( property in f ) {
      cleanPropPath = property.replace( /\[[0-9]*\]/, "" ) // WARN: Doesn't work if some properties use . or [] in their name
      isGranted = ability.can( 'read', data, cleanPropPath )
    }
    var authFields = permittedFieldsOf( ability, 'read', 'dashboard' )
  }
  private initPermissions() {
    const { rules, can, cannot } = AbilityBuilder.extract()
    can( 'read', 'dashboard', [ 'foo', 'foo.bar', 'foo.bar.foobar' ] )
    return rules
  }
  ngOnInit() {
    this.isAuthorized = this.isGranted.bind( this )
    const perm = [ "edit_dashboard", "view_dashboard" ]
    this.permissionsService.loadPermissions( perm )
  }

  public isGranted( allowedPermissions: string | string[], exceptPermissions: string | string[] ): Promise<boolean> {

    // Note that if allowed is empty hasPermission return TRUE
    return this.permissionsService.hasPermission( allowedPermissions ).then( ( isAllowed ) => {

      // if allowed, check except permissions
      if ( isAllowed ) {
        if ( exceptPermissions ) {
          this.permissionsService.hasPermission( exceptPermissions ).then( ( isExcept ) => {
            if ( isExcept ) return false
            return true
          } )
        } else {
          return true
        }
      } else {
        return false
      }
    } )
  }
}
