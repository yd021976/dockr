import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
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
// import { AdminModule } from './features-modules/admin/admin.module';
import { AppRoutingModule } from './/app-routing.module';
import { AppLoggerModule } from './shared/services/logger/app-logger/app-logger.module';
import { AdminModule } from './features-modules/admin/admin.module';
import { ServicesState } from './shared/store/states/services.state';
import { Acl2State } from './shared/store/states/acl2/acl2.state';

/**
 * Factory used by this module token APP_INITIALIZER -> Auth user with local token if one exists and is valid 
 * 
 * @param appsandbox 
 */
export function authUser( appsandbox: AppSandboxService ) {
  return () => appsandbox.login()
}

@NgModule( {
  declarations: [
    AppComponent,
  ],
  imports: [
    AuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule,
    ContainersModule,
    HomeModule,
    AppLoggerModule.forRoot(),
    NgxsModule.forRoot( [
      ApplicationState,
      UserState,
      TemplatesState,
      Acl2State,
      ServicesState
    ] ),
    NgxPermissionsModule.forRoot(),
    SettingsModule,
    // AdminModule,
    AdminModule,
    AppRoutingModule
  ],
  providers: [
    AppSandboxService,
    // Auth user at startup if a token exists and is valid (not expired)
    {
      provide: APP_INITIALIZER, useFactory: authUser, deps: [ AppSandboxService ], multi: true
    }
  ],
  exports: [],
  bootstrap: [ AppComponent ]
} )
export class AppModule { }
