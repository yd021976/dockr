import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoute } from '../../shared/models/app-route.model';
import { AdminComponent } from './containers/admin/admin.component';
import { AclComponent } from './components/acl/acl.component';


const routes: AppRoute[] = [
  {
    path: 'admin', component: AdminComponent, data: { isMenu: true, title: 'Admin', icon: 'fa-wrench' }, children: [
      { path: 'acl', component: AclComponent, data: { isMenu: true, link: 'admin/acl', title: 'Manage roles' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
