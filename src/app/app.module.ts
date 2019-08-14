import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxPermissionsModule } from 'ngx-permissions';


import { AppComponent } from './app.component';
import { ApplicationState } from './shared/store/states/application.state';
import { AuthModule } from './features-modules/auth/auth.module';
import { ComponentsModule } from './shared/components';
import { ContainersModule } from './shared/containers/containers.module';
import { HomeModule } from './features-modules/home/home.module';
import { AppSandboxService } from './shared/sandboxes/app/app-sandbox.service';
import { UserState } from './shared/store/states/user.state';
import { TemplatesState } from './shared/store/states/templates.state';
import { SettingsModule } from './features-modules/settings/settings.module';
import { AppRoutingModule } from './/app-routing.module';
import { AppLoggerModule } from './shared/services/logger/app-logger/app-logger.module';
import { AdminModule } from './features-modules/admin/admin.module';
import { ServicesState } from './shared/store/states/services.state';
import { AclUIState } from './shared/store/states/acl/ui.state/acl2.state';
import { SnackBarComponent } from './shared/components/snackbar/snack-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppNotificationsState } from './shared/store/states/application.notifications.state';
import { UsersState } from './shared/store/states/users.state';
import { AuthService } from './shared/services/auth/auth.service';
import { PermissionsService } from './shared/services/acl/permissions/permissions.service';
import { AclEntitiesState } from './shared/store/states/acl/entities.state/acl2.entities.state';
import { ApplicationLocksState } from './shared/store/states/locks/application.locks.state';

/**
 * Factory used by this module token APP_INITIALIZER -> Auth user with local token if one exists and is valid 
 * 
 * @param appsandbox 
 */
export function authUser( appsandbox: AppSandboxService ) {
  return () => Promise.resolve( appsandbox.startUpLogin() )
}

@NgModule( {
  declarations: [
    AppComponent,
    SnackBarComponent
  ],
  imports: [
    AuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule,
    ContainersModule,
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
    AppSandboxService, AuthService, PermissionsService,
    // Auth user at startup if a token exists and is valid (not expired)
    {
      provide: APP_INITIALIZER, useFactory: authUser, deps: [ AppSandboxService, AuthService ], multi: true
    }
  ],
  exports: [],
  entryComponents: [ SnackBarComponent ],
  bootstrap: [ AppComponent ]
} )
export class AppModule { }
