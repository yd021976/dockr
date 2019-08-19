import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeContainer } from './containers/home.container';
import { ApplicationRouteInterface } from '../../shared/models/application.route.model';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TodoComponent } from './components/todo/todo.component';

const routes: ApplicationRouteInterface[] = [
  {
    path: 'home', component: HomeContainer, data: { isMenu: true, title: 'Home', icon: 'fa-home' }, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full', data: { isMenu: false ,title:'empty'} },
      { path: 'dashboard', component: DashboardComponent, data: { isMenu: true, link: 'home/dashboard', title: 'Dashboard' } },
      { path: 'todos', component: TodoComponent, data: { isMenu: true, link: 'home/todos', title: 'Todos' } }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
