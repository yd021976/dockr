import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './components/users/users.component';
import { AclComponent } from './components/acl/acl.component';
import { ComponentsModule } from '../../shared/components';
import { AclContainer } from './containers/acl/acl.container';
import { UsersContainer } from './containers/users/users.container';
import { MatTreeModule, MatIconModule, MatButtonModule } from '@angular/material';
import { FileDatabase } from './components/acl/file-database';
import { FlexLayoutModule } from '@angular/flex-layout'
import { AdminAclSandboxService } from 'src/app/shared/sandboxes/containers/admin.acl.sandbox.service';
import { Acl2Component } from './components/acl2/acl.2.component';
import { RoleComponent } from './components/acl2/tree_nodes/role/role.component';
import { ServiceComponent } from './components/acl2/tree_nodes/service/service.component';
import { ActionComponent } from './components/acl2/tree_nodes/action/action.component';
import { FieldComponent } from './components/acl2/tree_nodes/field/field.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    AdminRoutingModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule
  ],
  declarations: [
    AclContainer,
    UsersContainer,
    UsersComponent,
    AclComponent,
    Acl2Component,
    RoleComponent,
    ServiceComponent,
    ActionComponent,
    FieldComponent,

  ],
  providers: [
    FileDatabase,
    AdminAclSandboxService
  ]
})
export class AdminModule { }
