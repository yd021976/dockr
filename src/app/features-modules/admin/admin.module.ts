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
import { AdminSiteSectionSandboxProviderToken } from './site.sections/sandboxes/site.sections.sandbox.token';
import { AdminSiteSectionSandboxService } from './site.sections/sandboxes/site.sections.sandbox.service';
import { AdminSiteSectionsContainer } from './site.sections/containers/site.sections.container';
import { siteSectionsServiceToken } from 'src/app/shared/services/site.sections/site.sections.token';
import { SiteSectionsService } from 'src/app/shared/services/site.sections/site.sections.service';
import { AdminSiteSectionsTreeComponent } from './site.sections/components/treeview/site.sections.tree.component';
import { AdminSiteSectionsRolesListComponent } from './site.sections/components/roles.list/site.sections.roles.list.component';

const components = [
  AclContainer, UsersContainer, UsersComponent, AclComponent, ActionComponent, FieldComponent, RoleComponent, ServiceComponent,
  RolesListComponent, UsersListComponent, UserDetailsComponent, UsersActionsComponent,
  NodeDetailComponent,
  RoleDetailComponent, ServiceDetailComponent, ActionDetailComponent, FieldDetailComponent,
  NodeActionsComponent, DefaultActionComponent, RoleActionComponent, ServiceActionComponent, CrudActionComponent, FieldActionComponent,
  AddRoleDialogComponent, AddServiceDialogComponent, CandeactivateAclDialog,
  AuthUsersAddUserDialog,
  TreenodeRendererComponent,
  AdminSiteSectionsContainer, AdminSiteSectionsTreeComponent, AdminSiteSectionsRolesListComponent
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
    {
      provide: siteSectionsServiceToken,
      useClass: SiteSectionsService,
      multi: false
    },
    /**
     * Container Sandboxes providers
     */
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
      provide: AdminSiteSectionSandboxProviderToken,
      multi: false,
      useClass: AdminSiteSectionSandboxService
    },
    /**
     * Container required services
     */

    TreeNodesService,
    ResourcesLocksService]
})
export class AdminModule { }