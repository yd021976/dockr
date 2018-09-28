import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { AppComponent } from './app.component';
import { ApplicationState } from './shared/store/states/application.state';
import { AuthModule } from './features-modules/auth/auth.module';
import { ComponentsModule } from './shared/components';
import { ContainersModule } from './shared/containers/containers.module';
import { HomeModule } from './features-modules/home/home.module';
import { SandboxAppService } from './shared/sandboxes/app/sandbox-app.service';
import { UserState } from './shared/store/states/user.state';
import { TemplatesState } from './shared/store/states/templates.state';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule,
    ContainersModule,
    HomeModule,
    LoggerModule.forRoot({ level: NgxLoggerLevel.TRACE }),
    NgxsModule.forRoot([ApplicationState, UserState, TemplatesState])
  ],
  providers: [
    SandboxAppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
