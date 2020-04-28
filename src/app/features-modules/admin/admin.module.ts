import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AclComponent } from './acl/components/acl.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminAclSandboxService } from 'src/app/features-modules/admin/acl/sandboxes/admin.acl.sandbox.service';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { AclContainer } from './acl/containers/acl.container';
import { UsersContainer } from './users/containers/users.container';
import { ActionComponent } from './acl/components/node-content-renderer/action/action.component';
import { FieldComponent } from './acl/components/node-content-renderer/field/field.component';
import { RoleComponent } from './acl/components/node-content-renderer/role/role.component';
import { ServiceComponent } from './acl/components/node-content-renderer/service/service.component';
import { UsersComponent } from './users/components/users.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TreeNodesService } from './acl/services/treeNodes.service';
import { NodeDetailComponent } from './acl/components/node-detail/node-detail.component';
import { RoleDetailComponent } from './acl/components/node-detail/node-types/role-detail/role-detail.component';
import { ServiceDetailComponent } from './acl/components/node-detail/node-types/service-detail/service-detail.component';
import { ActionDetailComponent } from './acl/components/node-detail/node-types/action-detail/action-detail.component';
import { FieldDetailComponent } from './acl/components/node-detail/node-types/field-detail/field-detail.component';
import { DefaultActionComponent } from './acl/components/node-actions/node-types/default-action/default-action.component';
import { RoleActionComponent } from './acl/components/node-actions/node-types/role-action/role-action.component';
import { ServiceActionComponent } from './acl/components/node-actions/node-types/service-action/service-action.component';
import { CrudActionComponent } from './acl/components/node-actions/node-types/crud-action/crud-action.component';
import { FieldActionComponent } from './acl/components/node-actions/node-types/field-action/field-action.component';
import { NodeActionsComponent } from './acl/components/node-actions/node-actions.component';
import { AddRoleDialogComponent } from './acl/components/dialogs/add.role/add.role.dialog.component';
import { AddServiceDialogComponent } from './acl/components/dialogs/add.service/add.service.dialog.component';
import { ResourcesLocksService } from 'src/app/shared/services/resource_locks/resources.locks.service';
import { CandeactivateAclDialog } from './acl/components/dialogs/can.deactivate.acl/can.deactivate.acl.dialog.component';
import { AdminUsersSandboxService } from 'src/app/features-modules/admin/users/sandboxes/admin.users.sandbox.service';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { RolesListComponent } from './users/components/roles.list/roles.list.component';
import { UsersListComponent } from './users/components/users.list/users.list.component';
import { UserDetailsComponent } from './users/components/user.details/user.details.component';
import { MatListModule } from '@angular/material/list';
import { UsersActionsComponent } from './users/components/users.actions/users.actions.component';
import { AuthUsersAddUserDialog } from './users/components/dialogs/add.user/add.user.dialog.component';
import { TreenodeRendererComponent } from './acl/components/node-treenode-renderer/treenode-renderer/treenode.renderer.component';
import { AdminAclSandboxProviderToken } from './acl/sandboxes/admin.acl.sandbox.token';
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

const components = [
  AclContainer, UsersContainer, UsersComponent, AclComponent, ActionComponent, FieldComponent, RoleComponent, ServiceComponent,
  AdminPermissionsContainer, AdminPermissionsTreeviewComponent, AdminPermissionsTreeviewNodeRenderer, AdminPermissionsTreeviewActionsComponent,
  RolesListComponent, UsersListComponent, UserDetailsComponent, UsersActionsComponent,
  NodeDetailComponent,
  RoleDetailComponent, ServiceDetailComponent, ActionDetailComponent, FieldDetailComponent,
  NodeActionsComponent, DefaultActionComponent, RoleActionComponent, ServiceActionComponent, CrudActionComponent, FieldActionComponent,
  AddRoleDialogComponent, AddServiceDialogComponent, CandeactivateAclDialog,
  AuthUsersAddUserDialog,
  TreenodeRendererComponent,
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
  entryComponents: [AddRoleDialogComponent, AddServiceDialogComponent, CandeactivateAclDialog, AuthUsersAddUserDialog],
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
      provide: AdminAclSandboxProviderToken,
      multi: false,
      useClass: AdminAclSandboxService
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
    TreeNodesService,
    AdminPermissionsTreedataService,
    ResourcesLocksService,
  ]
})
export class AdminModule { }