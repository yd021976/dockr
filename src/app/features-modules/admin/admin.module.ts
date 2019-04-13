import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AclComponent } from './components/acl/acl.component';
import { AdminComponent } from './containers/admin/admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminAclSandboxService } from 'src/app/shared/sandboxes/containers/admin.acl.sandbox.service';
import { FormsModule } from '@angular/forms';
import { MatTreeModule, MatIconModule, MatCheckboxModule, MatProgressBarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatToolbarModule, MatBadgeModule, MatDialogModule, MatSelectModule } from '@angular/material';
import { AclContainer } from './containers/acl/acl.container';
import { UsersContainer } from './containers/users/users.container';
import { ActionComponent } from './components/acl/treenodes/action/action.component';
import { FieldComponent } from './components/acl/treenodes/field/field.component';
import { RoleComponent } from './components/acl/treenodes/role/role.component';
import { ServiceComponent } from './components/acl/treenodes/service/service.component';
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

const components = [
  AclContainer, UsersContainer, UsersComponent, AclComponent, ActionComponent, FieldComponent, RoleComponent, ServiceComponent,
  NodeDetailComponent,
  RoleDetailComponent, ServiceDetailComponent, ActionDetailComponent, FieldDetailComponent,
  NodeActionsComponent, DefaultActionComponent, RoleActionComponent, ServiceActionComponent, CrudActionComponent, FieldActionComponent,
  AddRoleDialogComponent, AddServiceDialogComponent,
  // To delete
  AdminComponent
]

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    AdminRoutingModule,
    MatBadgeModule,
    FormsModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatDialogModule,
    FlexLayoutModule
  ],
  declarations: components,
  entryComponents: [AddRoleDialogComponent, AddServiceDialogComponent],
  providers: [AdminAclSandboxService, TreeNodesService]
})
export class AdminModule { }