import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { UsersContainer } from './users/containers/users.container';
import { UsersComponent } from './users/components/users.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ResourcesLocksService } from 'src/app/shared/services/resource_locks/resources.locks.service';
import { AdminUsersSandboxService } from 'src/app/features-modules/admin/users/sandboxes/admin.users.sandbox.service';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { RolesListComponent } from './users/components/roles.list/roles.list.component';
import { UsersListComponent } from './users/components/users.list/users.list.component';
import { UserDetailsComponent } from './users/components/user.details/user.details.component';
import { MatListModule } from '@angular/material/list';
import { UsersActionsComponent } from './users/components/users.actions/users.actions.component';
import { AuthUsersAddUserDialog } from './users/components/dialogs/add.user/add.user.dialog.component';
import { AdminUsersSandboxProviderToken } from './users/sandboxes/admin.users.sandbox.token';
import { AdminSiteZonesSandboxProviderToken } from './site.zones/sandboxes/site.zones.sandbox.token';
import { AdminSiteZonesSandboxService } from './site.zones/sandboxes/site.zones.sandbox.service';
import { AdminSiteZonesContainer } from './site.zones/containers/site.zones.container';
import { siteZonesServiceToken } from 'src/app/shared/services/site.zones/site.zones.token';
import { SiteZonesService } from 'src/app/shared/services/site.zones/site.zones.service';
import { AdminSiteZonesTreeComponent } from './site.zones/components/treeview/site.zones.tree.component';
import { AdminSiteZonesRolesListComponent } from './site.zones/components/roles.list/site.zones.roles.list.component';
import { AppInjectorToken } from 'src/app/main/app.injector.token';
import { AdminPermissionsContainer } from './permissions/containers/permissions.container';
import { AdminPermissionsSandboxProviderToken } from './permissions/sandboxes/admin.permissions.sandbox.token';
import { AdminPermissionsSandboxService } from './permissions/sandboxes/admin.permissions.sandbox.service';
import { AdminPermissionsTreeviewComponent } from './permissions/components/treeview/admin.permissions.treeview.component';
import { AdminPermissionsTreedataService } from './permissions/services/admin.permissions.treedata.service';
import { AdminPermissionsTreeviewNodeRenderer } from './permissions/components/treeview/node.renderer/treenode.renderer.component';
import { AdminPermissionsTreeviewActionsComponent } from './permissions/components/treeview/actions/admin.permissions.treeview.actions.component';
import { AdminPermissionsAddRoleDialogComponent } from './permissions/components/dialogs/add.role/add.role.dialog.component';

const components = [
  /** Permissions : Role based data permissions */
  AdminPermissionsContainer, AdminPermissionsTreeviewComponent, AdminPermissionsTreeviewNodeRenderer, AdminPermissionsTreeviewActionsComponent, AdminPermissionsAddRoleDialogComponent,
  /** User admin */
  UsersContainer, UsersComponent, RolesListComponent, UsersListComponent, UserDetailsComponent, UsersActionsComponent,
  /** Users admin */
  AuthUsersAddUserDialog,
  AdminSiteZonesContainer, AdminSiteZonesTreeComponent, AdminSiteZonesRolesListComponent
]

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    AdminRoutingModule,
    MatBadgeModule,
    FormsModule,
    MatTreeModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatListModule,
    FlexLayoutModule,
    ComponentsModule
  ],
  declarations: components,
  entryComponents: [AuthUsersAddUserDialog, AdminPermissionsAddRoleDialogComponent],
  providers: [
    /**
     * Container Sandboxes providers
     */
    {
      provide: siteZonesServiceToken,
      useClass: SiteZonesService,
      multi: false,
      deps: [AppInjectorToken]
    },
    {
      provide: AdminUsersSandboxProviderToken,
      multi: false,
      useClass: AdminUsersSandboxService
    },
    {
      provide: AdminSiteZonesSandboxProviderToken,
      multi: false,
      useClass: AdminSiteZonesSandboxService
    },
    {
      provide: AdminPermissionsSandboxProviderToken,
      multi: false,
      useClass: AdminPermissionsSandboxService
    },
    /**
     * Container required services
     */
    AdminPermissionsTreedataService,
    ResourcesLocksService,
  ]
})
export class AdminModule { }