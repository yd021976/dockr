import { Component, OnInit, Input, TemplateRef, Renderer2 } from '@angular/core';
import { NgxPermissionsService, NgxRolesService, NgxPermissionsConfigurationService } from 'ngx-permissions';

export type htmlElementChanges = {
  method: string,
  attribute: string,
  attributeValue: string
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public readonly read_dashboard: string = "read_dashboard";
  private currentPermissionAuthorized: string;

  @Input() data; // TODO: set data type for dashboard component
  constructor(private permissionsService: NgxPermissionsService, private rolesService: NgxRolesService, private serviceConf: NgxPermissionsConfigurationService, private renderer: Renderer2) {
    // Create fake permissions
    // this.permissionsService.addPermission('read_dashboard');
    // this.permissionsService.addPermission('update_dashboard');

    this.serviceConf.addPermissionStrategy('custom_authorized', this.authorizedStrategy);
    this.serviceConf.setDefaultOnAuthorizedStrategy('custom_authorized');
    this.serviceConf.setDefaultOnUnauthorizedStrategy('custom_authorized');
  }

  ngOnInit() {
  }

  // Sets permission authorized (will be used in next strategy function call)
  public authorized = (permissions): Promise<boolean> => {
    this.currentPermissionAuthorized = permissions;
    return this.permissionsService.hasPermission(permissions).then((status) => {
      return true;
    })
  }


  public authorizedStrategy = (templateRef: TemplateRef<any>) => {
    var perm = this.currentPermissionAuthorized;
    var element = templateRef.elementRef.nativeElement.nextSibling;
    var elementChanges: htmlElementChanges = this.htmlElementUnauthorized(element);
    this.renderer[elementChanges.method](element, elementChanges.attribute, elementChanges.attributeValue);
  }

  public unauthorizedStrategy = (templateRef: TemplateRef<any>) => {
    var element = templateRef.elementRef.nativeElement.nextSibling;
    var elementChanges: htmlElementChanges = this.htmlElementUnauthorized(element);
    this.renderer[elementChanges.method](element, elementChanges.attribute, elementChanges.attributeValue);
  }


  private htmlElementUnauthorized(element: any): htmlElementChanges {
    var changesOperations: htmlElementChanges = { method: 'setAttribute', attribute: 'disabled', attributeValue: 'false' };

    switch (element.nodeName) {
      case 'H3':
        changesOperations = { ...changesOperations, method: 'setProperty', attribute: 'innerText', attributeValue: 'You are authorized NOT to view this content' }
        break;
      case 'BUTTON':
        changesOperations = { ...changesOperations, method: 'setAttribute', attribute: 'disabled', attributeValue: 'true' }
        break;
      default:
        break;
    }
    return changesOperations;
  }

}
