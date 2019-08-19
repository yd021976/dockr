import { Component, OnInit, Input, TemplateRef, Renderer2, Inject } from '@angular/core';
import { AppPermissionDescriptor, actionTypes, HideBehaviors } from 'src/app/shared/directives/permissions/permission.directive';
import { DashboardSandboxInterface } from '../../sandboxes/dashboard/dashboard.sandbox.interface';
import { dashboardSandboxProviderToken } from '../../sandboxes/dashboard/dashboard.sandbox.token';

@Component( {
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
} )
export class DashboardComponent implements OnInit {
  @Input() data; // TODO: set data type for dashboard component
  public input_permissions: AppPermissionDescriptor = {
    action: actionTypes.VIEW,
    subject: '*',
    field: 'name',
    hideStyle: HideBehaviors.HIDDEN
  }
  /**
   * 
   */
  constructor( @Inject(dashboardSandboxProviderToken) public sandbox: DashboardSandboxInterface ) {

  }

  /**
   * 
   */
  ngOnInit() { }

  public toggle( testCase: string ) {
    switch ( testCase ) {
      case "input":
        if ( this.input_permissions.action == actionTypes.VIEW )
          this.input_permissions.action = actionTypes.UPDATE
        else
          this.input_permissions.action = actionTypes.VIEW
        break
      default:
        break
    }
  }
}
