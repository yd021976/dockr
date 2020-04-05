import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeContainer } from './containers/home.container';
import { ApplicationRouteInterface } from '../../shared/models/application.route.model';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TodoComponent } from './components/todo/todo.component';
import { AppInjectorToken } from 'src/app/main/app.injector.token';
import { siteZonesServiceToken } from 'src/app/shared/services/site.zones/site.zones.token';
import { SiteZonesService } from 'src/app/shared/services/site.zones/site.zones.service';

const routes: ApplicationRouteInterface[] = [
  {
    path: 'home', component: HomeContainer, data: { isMenu: true, title: 'Home', icon: 'fa-home', siteZone: 'home' }, resolve: { 'roles': siteZonesServiceToken }, runGuardsAndResolvers: 'always', children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full', data: { isMenu: false, title: 'empty',siteZone:'dashboard-home' } },
      { path: 'dashboard', component: DashboardComponent, data: { isMenu: true, link: 'home/dashboard', title: 'Dashboard', siteZone: 'dashboard' }, resolve: { 'roles': siteZonesServiceToken } },
      { path: 'todos', component: TodoComponent, data: { isMenu: true, link: 'home/todos', title: 'Todos', siteZone: 'todos' }, resolve: { 'roles': siteZonesServiceToken } }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  providers: [
    {
      provide: siteZonesServiceToken,
      useClass: SiteZonesService,
      multi: false,
      deps: [AppInjectorToken]
    }
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
