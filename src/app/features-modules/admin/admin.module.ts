import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AclComponent } from './components/acl/acl.component';
import { AdminComponent } from './containers/admin/admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminAclSandboxService } from 'src/app/shared/sandboxes/containers/admin.acl.sandbox.service';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { AclContainer } from './containers/acl/acl.container';
import { UsersContainer } from './containers/users/users.container';
import { ActionComponent } from './components/acl/node-content-renderer/action/action.component';
import { FieldComponent } from './components/acl/node-content-renderer/field/field.component';
import { RoleComponent } from './components/acl/node-content-renderer/role/role.component';
import { ServiceComponent } from './components/acl/node-content-renderer/service/service.component';
import { UsersComponent } from './components/users/users.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TreeNodesService } from './services/treeNodes.service';
import { NodeDetailComponent } from './components/acl/node-detail/node-detail.component';
import { RoleDetailComponent } from './components/acl/node-detail/node-types/role-detail/role-detail.component';
import { ServiceDetailComponent } from './components/acl/node-detail/node-types/service-detail/service-detail.component';
import { ActionDetailComponent } from './components/acl/node-detail/node-types/action-detail/action-detail.component';
import { FieldDetailComponent } from './components/acl/node-detail/node-types/field-detail/field-detail.component';
import { DefaultActionComponent } from './components/acl/node-actions/node-types/default-action/default-action.component';
import { RoleActionComponent } from './components/acl/node-actions/node-types/role-action/role-action.component';
import { ServiceActionComponent } from './components/acl/node-actions/node-types/service-action/service-action.component';
import { CrudActionComponent } from './components/acl/node-actions/node-types/crud-action/crud-action.component';
import { FieldActionComponent } from './components/acl/node-actions/node-types/field-action/field-action.component';
import { NodeActionsComponent } from './components/acl/node-actions/node-actions.component';
import { AddRoleDialogComponent } from './components/acl/dialogs/add.role/add.role.dialog.component';
import { AddServiceDialogComponent } from './components/acl/dialogs/add.service/add.service.dialog.component';
import { ResourcesLocksService } from 'src/app/shared/services/resource_locks/resources.locks.service';
import { CandeactivateAclDialog } from './components/acl/dialogs/can.deactivate.acl/can.deactivate.acl.dialog.component';
import { AdminUsersSandboxService } from 'src/app/shared/sandboxes/containers/admin.users.sandbox.service';
import { ComponentsModule } from 'src/app/shared/components';
import { RolesListComponent } from './components/users/roles.list/roles.list.component';
import { UsersListComponent } from './components/users/users.list/users.list.component';
import { UserDetailsComponent } from './components/users/user.details/user.details.component';
import { MatListModule } from '@angular/material/list';
import { UsersActionsComponent } from './components/users/users.actions/users.actions.component';
import { AuthUsersAddUserDialog } from './components/users/dialogs/add.user/add.user.dialog.component';
import { TreenodeRendererComponent } from './components/acl/node-treenode-renderer/treenode-renderer/treenode-renderer.component';

const components = [
  AclContainer, UsersContainer, UsersComponent, AclComponent, ActionComponent, FieldComponent, RoleComponent, ServiceComponent,
  RolesListComponent, UsersListComponent, UserDetailsComponent,UsersActionsComponent,
  NodeDetailComponent,
  RoleDetailComponent, ServiceDetailComponent, ActionDetailComponent, FieldDetailComponent,
  NodeActionsComponent, DefaultActionComponent, RoleActionComponent, ServiceActionComponent, CrudActionComponent, FieldActionComponent,
  AddRoleDialogComponent, AddServiceDialogComponent, CandeactivateAclDialog,
  AuthUsersAddUserDialog,
  TreenodeRendererComponent,
  // To delete
  AdminComponent
]

@NgModule( {
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
  entryComponents: [ AddRoleDialogComponent, AddServiceDialogComponent, CandeactivateAclDialog, AuthUsersAddUserDialog ],
  providers: [ AdminAclSandboxService, AdminUsersSandboxService, TreeNodesService, ResourcesLocksService ]
} )
export class AdminModule { }