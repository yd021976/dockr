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
  public isAuthorized: Function

  @Input() data; // TODO: set data type for dashboard component
  constructor(private permissionsService: NgxPermissionsService, private rolesService: NgxRolesService) {

  }

  ngOnInit() {
    this.isAuthorized = this.isGranted.bind(this)
    const perm = ["edit_dashboard", "view_dashboard"]
    this.permissionsService.loadPermissions(perm)
  }

  public isGranted(allowedPermissions: string | string[], exceptPermissions: string | string[]): Promise<boolean> {

    // Note that if allowed is empty hasPermission return TRUE
    return this.permissionsService.hasPermission(allowedPermissions).then((isAllowed) => {

      // if allowed, check except permissions
      if (isAllowed) {
        if (exceptPermissions) {
          this.permissionsService.hasPermission(exceptPermissions).then((isExcept) => {
            if (isExcept) return false
            return true
          })
        } else {
          return true
        }
      } else {
        return false
      }
    })
  }
}
