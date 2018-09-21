import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { AppComponent } from './app.component';
import { ApplicationState } from './shared/store/states/application.state';
import { ComponentsModule } from './shared/components';
import { ContainersModule } from './shared/containers/containers.module';
import { LoginModule } from './features-modules/login/login.module';
import { SandboxAppService } from './shared/sandboxes/app/sandbox-app.service';
import { UserState } from './shared/store/states/user.state';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule,
    ContainersModule,
    LoginModule,
    NgxsModule.forRoot([ApplicationState, UserState])
  ],
  providers: [
    SandboxAppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
