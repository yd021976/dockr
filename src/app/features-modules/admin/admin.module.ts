import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './components/users/users.component';
import { AclComponent } from './components/acl/acl.component';
import { ComponentsModule } from '../../shared/components';
import { AclContainer } from './containers/acl/acl.container';
import { UsersContainer } from './containers/users/users.container';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    AdminRoutingModule
  ],
  declarations: [
    AclContainer,
    UsersContainer,
    UsersComponent, 
    AclComponent]
})
export class AdminModule { }
