import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AclComponent } from './components/acl/acl.component';
import { AdminComponent } from './containers/admin/admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminAclSandboxService } from 'src/app/shared/sandboxes/containers/admin.acl.sandbox.service';
import { FormsModule } from '@angular/forms';
import { MatTreeModule, MatIconModule, MatCheckboxModule, MatProgressBarModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    MatTreeModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressBarModule
  ],
  declarations: [AdminComponent, AclComponent],
  providers: [AdminAclSandboxService]
})
export class AdminModule { }