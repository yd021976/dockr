import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { AppRoute } from '../../shared/models/app-route.model';

const routes: AppRoute[] = [
  {
    path: 'home', data: { isMenu: true, title: 'Home', icon: '' }, children: [
      { path: 'dashboard', component: DashboardComponent, data: { isMenu: true, link: 'home/dashboard', title: 'Dashboard' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
