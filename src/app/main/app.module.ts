import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxPermissionsModule } from 'ngx-permissions';


import { AppContainer } from './containers/app.container';
import { ApplicationState } from '../shared/store/states/application.state';
import { AuthModule } from '../features-modules/auth/auth.module';
import { ComponentsModule } from '../shared/components/components.module';
import { LayoutsModule } from '../shared/containers/layouts/layouts.module';
import { HomeModule } from '../features-modules/home/home.module';
import { AppSandboxService } from './sandboxes/app-sandbox.service';
import { UserState } from '../shared/store/states/user.state';
import { TemplatesState } from '../shared/store/states/templates.state';
import { SettingsModule } from '../features-modules/settings/settings.module';
import { AppRoutingModule } from './/app-routing.module';
import { AppLoggerModule } from '../shared/services/logger/app-logger/app-logger.module';
import { AdminModule } from '../features-modules/admin/admin.module';
import { ServicesState } from '../shared/store/states/services.state';
import { AclUIState } from '../shared/store/states/acl/ui.state/acl2.state';
import { SnackBarComponent } from '../shared/components/snackbar/snack-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppNotificationsState } from '../shared/store/states/application.notifications.state';
import { UsersState } from '../shared/store/states/users.state';
import { AuthService } from '../shared/services/auth/auth.service';
import { PermissionsService } from '../shared/services/acl/permissions/permissions.service';
import { AclEntitiesState } from '../shared/store/states/acl/entities.state/acl2.entities.state';
import { ApplicationLocksState } from '../shared/store/states/locks/application.locks.state';
import { ApplicationInjector } from '../shared/application.injector.class'
import { RolesService } from '../shared/services/acl/roles/roles.service';
import { FeathersjsBackendService } from '../shared/services/backend.api.endpoint/providers/feathers/socket.io/feathers.service';
import { BackendServiceToken } from '../shared/services/backend.api.endpoint/backend.service.token';
/**
 * Factory used by this module token APP_INITIALIZER -> Auth user with local token if one exists and is valid 
 * 
 * @param appsandbox 
 */
export function authUser( appsandbox: AppSandboxService ) {
  return () => Promise.resolve( appsandbox.startUpLogin() )
}

export function initAppInjector( injector: Injector ) {
  ApplicationInjector.injector = injector
}

@NgModule( {
  declarations: [
    AppContainer,
    SnackBarComponent
  ],
  imports: [
    AuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule,
    LayoutsModule,
    HomeModule,
    AppLoggerModule.forRoot(),
    MatSnackBarModule,
    NgxsModule.forRoot( [
      ApplicationState,
      UserState,
      UsersState,
      TemplatesState,
      AclUIState,
      AclEntitiesState,
      ApplicationLocksState,
      ServicesState,
      AppNotificationsState
    ] ),
    NgxPermissionsModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    SettingsModule,
    // AdminModule,
    AdminModule,
    AppRoutingModule,

  ],
  providers: [
    PermissionsService,
    AuthService,
    RolesService,
    /**
     * Backend service
     */
    {
      provide: BackendServiceToken,
      useClass: FeathersjsBackendService,
      multi: false
    },
    {
      provide: 'AppInjector',
      multi: false,
      useFactory: initAppInjector,
      deps: [ Injector ]
    },
    {
      provide: AppSandboxService,
      multi: false,
      useClass: AppSandboxService,
      deps: [ AuthService, PermissionsService, RolesService, 'AppInjector' ]
    },
    // Auth user at startup if a token exists and is valid (not expired)
    {
      provide: APP_INITIALIZER, useFactory: authUser, deps: [ AppSandboxService ], multi: true
    }
  ],
  exports: [],
  entryComponents: [ SnackBarComponent ],
  bootstrap: [ AppContainer ]
} )
export class AppModule { }
