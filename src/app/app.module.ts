import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
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
import { RolesState } from './shared/store/states/acl/roles.state';
import { BackendServicesState } from './shared/store/states/acl/backend-services.state';
import { AclState } from './shared/store/states/acl/state/acl.state';
import { CrudOperationsState } from './shared/store/states/acl/crud-operations.state';
import { DataModelsState } from './shared/store/states/acl/datamodels.state';
import { AdminModule } from './features-modules/admin/admin.module';
import { ServicesState } from './shared/store/states/services.state';

@NgModule({
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
    NgxsModule.forRoot([
      ApplicationState,
      UserState,
      TemplatesState,
      AclState,
      RolesState,
      BackendServicesState,
      CrudOperationsState, DataModelsState,
      ServicesState
    ]),
    NgxPermissionsModule.forRoot(),
    SettingsModule,
    // AdminModule,
    AdminModule,
    AppRoutingModule
  ],
  providers: [
    AppSandboxService
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
