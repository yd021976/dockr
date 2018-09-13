import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SandboxAppService } from '../shared/sandboxes/app/sandbox-app.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [SandboxAppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
