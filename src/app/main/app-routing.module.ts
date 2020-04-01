import { NgModule, APP_INITIALIZER, Injector, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRouteInterface } from '../shared/models/application.route.model';
import { RouterModule } from '@angular/router';
import { AclCanDeactivateGuard } from '../features-modules/admin/acl/guards/acl.can.deactivate.guard';
import { routerConfigServiceToken } from '../shared/services/router.config/router.config.token';
import { RouterConfigService } from '../shared/services/router.config/router.config.service';
import { AppInjectorToken } from './app.injector.token';

let routes: ApplicationRouteInterface[] = [
  { path: '', redirectTo: 'home/dashboard', pathMatch: 'full', resolve: { roles: routerConfigServiceToken } }
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
      provide: routerConfigServiceToken,
      useClass: RouterConfigService,
      multi: false,
      deps: [AppInjectorToken]
    }
  ]
})

export class AppRoutingModule { }
