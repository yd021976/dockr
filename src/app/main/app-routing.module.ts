import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRouteInterface } from '../shared/models/application.route.model';
import { RouterModule } from '@angular/router';
import { AclCanDeactivateGuard } from '../features-modules/admin/acl/guards/acl.can.deactivate.guard';


export const routes: ApplicationRouteInterface[] = [
  { path: '', redirectTo: 'home/dashboard', pathMatch: 'full' }
]

@NgModule( {
  imports: [
    CommonModule,
    RouterModule.forRoot( routes )
  ],
  exports: [ RouterModule ],
  declarations: []
} )

export class AppRoutingModule { }
