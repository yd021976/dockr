import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoute } from '../../shared/models/app-route.model';
import { UsersComponent } from './components/users/users.component';
import { AclComponent } from './components/acl/acl.component';
import { AdminComponent } from './containers/admin/admin.component';

const routes: AppRoute[] = [
  {
    path: 'admin', data: { isMenu: true, title: 'admin', icon: 'fa-wrench' }, component: AdminComponent, children: [
      { path: 'users', component: UsersComponent, data: { isMenu: true, link: 'admin/users', title: 'Manage Users' } },
      { path: 'acl', component: AclComponent, data: { isMenu: true, link: 'admin/acl', title: 'Permissions' } }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
