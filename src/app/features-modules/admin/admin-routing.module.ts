import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApplicationRouteInterface } from '../../shared/models/application.route.model';
import { UsersContainer } from './users/containers/users.container';
import { AclContainer } from './acl/containers/acl.container';
import { AclCanDeactivateGuard } from './acl/guards/acl.can.deactivate.guard';
import { AclCanActivate } from './acl/guards/acl.can.activate.guard';
import { AdminAclSandboxProviderToken } from './acl/sandboxes/admin.acl.sandbox.token';
import { AdminUsersSandboxProviderToken } from './users/sandboxes/admin.users.sandbox.token';
import { AdminSiteZonesContainer } from './site.zones/containers/site.zones.container';
import { siteZonesServiceToken } from 'src/app/shared/services/site.zones/site.zones.token';
import { AdminSiteZonesSandboxProviderToken } from './site.zones/sandboxes/site.zones.sandbox.token';
import { AdminPermissionsContainer } from './permissions/containers/permissions.container';
import { AdminPermissionsSandboxProviderToken } from './permissions/sandboxes/admin.permissions.sandbox.token';

const routes: ApplicationRouteInterface[] = [
  {
    path: 'admin', canActivate: [AclCanActivate], data: { isMenu: true, title: 'Admin', icon: 'fa-wrench', siteZone: 'admin' }, children: [
      // {
      //   path: 'acl',
      //   component: AclContainer,
      //   canActivate: [AclCanActivate],
      //   canDeactivate: [AclCanDeactivateGuard],
      //   resolve: { roles: AdminAclSandboxProviderToken },
      //   data: { isMenu: true, link: 'admin/acl', title: 'Data & Services permissions', siteZone: 'acl' }
      // },
      {
        path: 'permissions',
        component: AdminPermissionsContainer,
        canActivate: [],
        canDeactivate: [],
        resolve: { roles: AdminPermissionsSandboxProviderToken },
        data: { isMenu: true, link: 'admin/permissions', title: 'Roles permissions', siteZone: 'permissions' }
      },
      {
        path: 'users',
        component: UsersContainer,
        canActivate: [AclCanActivate],
        resolve: { users: AdminUsersSandboxProviderToken },
        data: { isMenu: true, link: 'admin/users', title: 'Manage Users', siteZone: 'users' }
      },
      {
        path: 'site-zones',
        component: AdminSiteZonesContainer,
        canActivate: [AclCanActivate],
        resolve: { 'site_zones_roles': siteZonesServiceToken, 'routesState':AdminSiteZonesSandboxProviderToken },
        data: { isMenu: true, link: 'admin/site-zones', title: 'Manage site zones permissions', siteZone: 'site-zones' }
      },
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [AclCanDeactivateGuard, AclCanActivate]
})
export class AdminRoutingModule { }