import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApplicationRouteInterface } from '../../shared/models/application.route.model';
import { UsersContainer } from './users/containers/users.container';
import { AclContainer } from './acl/containers/acl.container';
import { MatTreeModule } from '@angular/material/tree';
import { AclCanDeactivateGuard } from './acl/guards/acl.guard';

const routes: ApplicationRouteInterface[] = [
  {
    path: 'admin', data: { isMenu: true, title: 'admin', icon: 'fa-wrench' }, children: [
      { path: 'users', component: UsersContainer, data: { isMenu: true, link: 'admin/users', title: 'Manage Users' } },
      { path: 'acl', component: AclContainer, canDeactivate: [ AclCanDeactivateGuard ], data: { isMenu: true, link: 'admin/acl', title: 'Permissions' } }
    ]
  }
];
@NgModule( {
  imports: [
    RouterModule.forChild( routes ),
    MatTreeModule
  ],
  exports: [ RouterModule ],
  providers: [ AclCanDeactivateGuard ]
} )
export class AdminRoutingModule { }