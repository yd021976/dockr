import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ApplicationRouteInterface } from '../../shared/models/application.route.model';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './containers/settings/settings.component';
import { siteZonesServiceToken } from 'src/app/shared/services/site.zones/site.zones.token';
import { SiteZonesService } from 'src/app/shared/services/site.zones/site.zones.service';
import { AppInjectorToken } from 'src/app/main/app.injector.token';


const routes: ApplicationRouteInterface[] = [
  {
    path: 'settings', component: SettingsComponent, data: { isMenu: true, title: 'Settings', icon: 'fa-wrench', siteZone: 'settings' }, resolve: siteZonesServiceToken, children: [
      { path: 'profile', component: ProfileComponent, data: { isMenu: true, link: 'settings/profile', title: 'User profile', siteZone: 'profile' }, resolve: siteZonesServiceToken }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: siteZonesServiceToken,
      useClass: SiteZonesService,
      multi: false,
      deps: [AppInjectorToken]
    }
  ]
})
export class SettingsRoutingModule { }
