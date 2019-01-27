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
import {FlexLayoutModule} from '@angular/flex-layout'

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
    AclComponent
  ],
  providers:[
    FileDatabase
  ]
})
export class AdminModule { }
