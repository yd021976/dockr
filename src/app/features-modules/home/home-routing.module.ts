import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeContainer } from './containers/home.container';
import { ApplicationRouteInterface } from '../../shared/models/application.route.model';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TodoComponent } from './components/todo/todo.component';
import { routerConfigServiceToken } from 'src/app/shared/services/router.config/router.config.token';
import { RouterConfigService } from 'src/app/shared/services/router.config/router.config.service';
import { AppInjectorToken } from 'src/app/main/app.injector.token';

const routes: ApplicationRouteInterface[] = [
  {
    path: 'home', component: HomeContainer, data: { isMenu: true, title: 'Home', icon: 'fa-home', siteZone: 'home' }, resolve: { 'roles': routerConfigServiceToken }, runGuardsAndResolvers: 'always', children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full', data: { isMenu: false, title: 'empty' } },
      { path: 'dashboard', component: DashboardComponent, data: { isMenu: true, link: 'home/dashboard', title: 'Dashboard', siteZone: 'dashboard' }, resolve: { 'roles': routerConfigServiceToken } },
      { path: 'todos', component: TodoComponent, data: { isMenu: true, link: 'home/todos', title: 'Todos', siteZone: 'todos' }, resolve: { 'roles': routerConfigServiceToken } }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  providers: [
    {
      provide: routerConfigServiceToken,
      useClass: RouterConfigService,
      multi: false,
      deps: [AppInjectorToken]
    }
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
