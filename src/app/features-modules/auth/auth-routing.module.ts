import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginContainer } from './containers/login/login.container';
import { LogoutContainer } from './containers/logout/logout.container';
import { RegisterContainer } from './containers/register/register.component';
import { ApplicationRouteInterface } from 'src/app/shared/models/application.route.model';
import { siteZonesServiceToken } from 'src/app/shared/services/site.zones/site.zones.token';
import { SiteZonesService } from 'src/app/shared/services/site.zones/site.zones.service';
import { AppInjectorToken } from 'src/app/main/app.injector.token';

const routes: ApplicationRouteInterface[] = [
  {
    path: 'auth', data: { isMenu: false, siteZone: 'auth', title: 'Authentication' }, children: [
      { path: 'login', component: LoginContainer, data: { isMenu: false, siteZone: 'login', title: 'Login' } },
      { path: 'logout', component: LogoutContainer, data: { isMenu: false, siteZone: 'logout', title: 'Logout' } },
      { path: 'register', component: RegisterContainer, data: { isMenu: false, siteZone: 'register', title: 'Register' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [{
    provide: siteZonesServiceToken,
    useClass: SiteZonesService,
    multi: false,
    deps: [AppInjectorToken]
  }]
})
export class AuthRoutingModule { }
