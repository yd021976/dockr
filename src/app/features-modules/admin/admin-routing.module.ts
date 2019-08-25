import { NgModule, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApplicationRouteInterface } from '../../shared/models/application.route.model';
import { UsersContainer } from './users/containers/users.container';
import { AclContainer } from './acl/containers/acl.container';
import { AclCanDeactivateGuard } from './acl/guards/acl.can.deactivate.guard';
import { AclCanActivate } from './acl/guards/acl.can.activate.guard';
import { AdminAclSandboxProviderToken } from './acl/sandboxes/admin.acl.sandbox.token';

const routes: ApplicationRouteInterface[] = [
  {
    path: 'admin', data: { isMenu: true, title: 'admin', icon: 'fa-wrench' }, canActivate: [ AclCanActivate ], children: [
      { path: 'users', component: UsersContainer, canActivate: [ AclCanActivate ], data: { isMenu: true, link: 'admin/users', title: 'Manage Users' } },
      { path: 'acl', component: AclContainer, canActivate: [ AclCanActivate ], canDeactivate: [ AclCanDeactivateGuard ], resolve: { roles: AdminAclSandboxProviderToken }, data: { isMenu: true, link: 'admin/acl', title: 'Permissions' } }
    ]
  }
];
@NgModule( {
  imports: [
    RouterModule.forChild( routes )
  ],
  exports: [ RouterModule ],
  providers: [ AclCanDeactivateGuard, AclCanActivate ]
} )
export class AdminRoutingModule { }