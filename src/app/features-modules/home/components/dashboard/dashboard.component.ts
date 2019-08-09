import { Component, OnInit, Input, TemplateRef, Renderer2 } from '@angular/core';
import { DashboardSandbox } from 'src/app/shared/sandboxes/containers/dashboard-sandbox.service';
import { AppPermissionDescriptor, actionTypes, BehaviorTypes, HideBehaviors } from 'src/app/shared/directives/permissions/permission.directive';

@Component( {
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
} )
export class DashboardComponent implements OnInit {
  @Input() data; // TODO: set data type for dashboard component
  public input_permissions: AppPermissionDescriptor = {
    action: actionTypes.VIEW,
    subject: 'test',
    field: 'name',
    notAllowedBehavior: BehaviorTypes.HIDE,
    allowedBehavior:BehaviorTypes.SHOW,
    hideStyle: HideBehaviors.HIDDEN
  }
  /**
   * 
   */
  constructor( public sandbox: DashboardSandbox ) {

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
