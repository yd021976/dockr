import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './containers/home/home.component';
import { AppRoute } from '../../shared/models/app-route.model';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TodoComponent } from './components/todo/todo.component';

const routes: AppRoute[] = [
  {
    path: 'home', component: HomeComponent, data: { isMenu: true, title: 'Home', icon: 'fa-home' }, children: [
      { path: '', redirectTo: 'dashboard',pathMatch:'full' },
      { path: 'dashboard', component: DashboardComponent, data: { isMenu: true, link: 'home/dashboard', title: 'Dashboard' } },
      { path: 'todos', component: TodoComponent, data: { isMenu: true, link: 'home/todos', title: 'Todos' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
