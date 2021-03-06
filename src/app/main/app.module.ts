import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, Injector, InjectionToken } from '@angular/core';


import { AppContainer } from './containers/app.container';
import { AuthModule } from '../features-modules/auth/auth.module';
import { ComponentsModule } from '../shared/components/components.module';
import { LayoutsModule } from '../shared/containers/layouts/layouts.module';
import { HomeModule } from '../features-modules/home/home.module';
import { AppSandboxService } from './sandboxes/app-sandbox.service';
import { SettingsModule } from '../features-modules/settings/settings.module';
import { AppRoutingModule } from './/app-routing.module';
import { AppLoggerModule } from '../shared/services/logger/app-logger/app-logger.module';
import { AdminModule } from '../features-modules/admin/admin.module';
import { SnackBarComponent } from '../shared/components/snackbar/snack-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../shared/services/auth/auth.service';
import { PermissionsService } from '../shared/services/acl/permissions/permissions.service';
import { RolesService } from '../shared/services/acl/roles/roles.service';
import { FeathersjsBackendService } from '../shared/services/backend.api.endpoint/providers/feathers/socket.io/feathers.service';
import { BackendServiceToken } from '../shared/services/backend.api.endpoint/backend.service.token';
import { ApplicationStoreModule } from '../shared/store/store.module';
import { AppInjectorToken, initAppInjector } from './app.injector.token'
import { Store, Actions } from '@ngxs/store';
import { appSandboxTokenProvider } from './sandboxes/app-sandbox-token';



/**
 * Factory used by this module token APP_INITIALIZER -> Auth user with local token if one exists and is valid 
 * 
 * @param appsandbox 
 */
export function authUser(appsandbox: AppSandboxService) {
  return () => appsandbox.init()
}


@NgModule({
  declarations: [
    AppContainer,
    SnackBarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ApplicationStoreModule,
    ComponentsModule,
    AppLoggerModule.forRoot(),
    MatSnackBarModule,


    /**
     * Application Layour module
     */
    LayoutsModule,

    /**
     * Application modules
     */
    AuthModule,
    HomeModule,
    SettingsModule,
    AdminModule,
    AppRoutingModule

  ],
  providers: [
    /**
    * Whole application Backend API service
    */
    {
      provide: BackendServiceToken,
      useClass: FeathersjsBackendService,
      multi: false
    },

    /**
     * Required services at app startup/init 
     */
    PermissionsService,
    AuthService,
    RolesService,


    /**
     * For classes inheritance convenience, bring a global Injector singleton (i.e Can use super() in subclass instead of super(service1, service2 ....) )
     */
    {
      provide: AppInjectorToken,
      multi: false,
      useFactory: initAppInjector,
      deps: [Injector]
    },

    /**
     * Main app sandbox
     */
    {
      provide: appSandboxTokenProvider,
      multi: false,
      useClass: AppSandboxService,
      deps: [Store, Actions, AuthService, PermissionsService, RolesService, AppInjectorToken]
    },

    /**
     *  Auth user at startup if a token exists and is valid (not expired)
     */
    {
      provide: APP_INITIALIZER, useFactory: authUser, deps: [appSandboxTokenProvider, Store, Actions], multi: true
    }
  ],
  exports: [],
  entryComponents: [SnackBarComponent],
  bootstrap: [AppContainer]
})
export class AppModule { }
