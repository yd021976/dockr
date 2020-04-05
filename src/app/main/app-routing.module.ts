import { NgModule, APP_INITIALIZER, Injector, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRouteInterface } from '../shared/models/application.route.model';
import { RouterModule } from '@angular/router';
import { AppInjectorToken } from './app.injector.token';
import { siteZonesServiceToken } from '../shared/services/site.zones/site.zones.token';
import { SiteZonesService } from '../shared/services/site.zones/site.zones.service';

let routes: ApplicationRouteInterface[] = [
  { path: '', redirectTo: 'home/dashboard', pathMatch: 'full', resolve: { 'site_zones_roles': siteZonesServiceToken }, data: { isMenu: false, siteZone: 'main-home' } }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: [],
  providers: [
    {
      provide: siteZonesServiceToken,
      useClass: SiteZonesService,
      multi: false,
      deps: [AppInjectorToken]
    }
  ]
})

export class AppRoutingModule { }
