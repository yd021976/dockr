import { NgModule, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApplicationRouteInterface } from '../../shared/models/application.route.model';
import { UsersContainer } from './users/containers/users.container';
import { AclContainer } from './acl/containers/acl.container';
import { AclCanDeactivateGuard } from './acl/guards/acl.can.deactivate.guard';
import { AclCanActivate } from './acl/guards/acl.can.activate.guard';
import { AdminAclSandboxProviderToken } from './acl/sandboxes/admin.acl.sandbox.token';
import { AdminUsersSandboxProviderToken } from './users/sandboxes/admin.users.sandbox.token';
import { AdminSiteZonesContainer } from './site.zones/containers/site.zones.container';
import { AdminSiteZonesSandboxProviderToken } from './site.zones/sandboxes/site.zones.sandbox.token';

const routes: ApplicationRouteInterface[] = [
  {
    path: 'admin', canActivate: [ AclCanActivate ], data: { isMenu: true, title: 'admin', icon: 'fa-wrench', section: 'admin' }, children: [
      {
        path: 'acl',
        component: AclContainer,
        canActivate: [ AclCanActivate ],
        canDeactivate: [ AclCanDeactivateGuard ],
        resolve: { roles: AdminAclSandboxProviderToken },
        data: { isMenu: true, link: 'admin/acl', title: 'Data & Services permissions' }
      },
      {
        path: 'users',
        component: UsersContainer,
        canActivate: [ AclCanActivate ],
        resolve: { users: AdminUsersSandboxProviderToken },
        data: { isMenu: true, link: 'admin/users', title: 'Manage Users' }
      },
      {
        path: 'site-sections',
        component: AdminSiteZonesContainer,
        canActivate: [ AclCanActivate ],
        resolve: { site_sections: AdminSiteZonesSandboxProviderToken },
        data: { isMenu: true, link: 'admin/site-sections', title: 'Manage site section permissions', section: 'site-sections' }
      },
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