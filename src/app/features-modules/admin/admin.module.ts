import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './containers/admin/admin.component';
import { UsersComponent } from './components/users/users.component';
import { AclComponent } from './components/acl/acl.component';
import { ComponentsModule } from '../../shared/components';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    AdminRoutingModule
  ],
  declarations: [AdminComponent, UsersComponent, AclComponent]
})
export class AdminModule { }
