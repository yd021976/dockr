import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { ProfileComponent } from './containers/profile/profile.component';
import { SettingsSandboxService } from 'src/app/shared/sandboxes/containers/settings-sandbox.service';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule
  ],
  declarations: [ProfileComponent],
  providers: [SettingsSandboxService]
})
export class SettingsModule { }
