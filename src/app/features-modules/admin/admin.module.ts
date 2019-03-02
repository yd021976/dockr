import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AclComponent } from './components/acl/acl.component';
import { AdminComponent } from './containers/admin/admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminAclSandboxService } from 'src/app/shared/sandboxes/containers/admin.acl.sandbox.service';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  declarations: [AdminComponent, AclComponent],
  providers: [AdminAclSandboxService]
})
export class AdminModule { }