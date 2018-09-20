import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ComponentsModule } from './shared/components';
import { ContainersModule } from './shared/containers/containers.module';
import { SandboxAppService } from './shared/sandboxes/app/sandbox-app.service';
import { UserActionsComponent } from './shared/store/actions/user-actions/user-actions.component';

@NgModule({
  declarations: [
    AppComponent,
    UserActionsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule,
    ContainersModule
  ],
  providers: [
    SandboxAppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
