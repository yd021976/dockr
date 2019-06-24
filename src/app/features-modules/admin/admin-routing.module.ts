import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoute } from '../../shared/models/app-route.model';
import { UsersContainer } from './containers/users/users.container';
import { AclContainer } from './containers/acl/acl.container';
import { MatTreeModule } from '@angular/material/tree';
import { AclCanDeactivateGuard } from './guards/acl.guard';

const routes: AppRoute[] = [
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