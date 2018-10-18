import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsSandboxService } from 'src/app/shared/sandboxes/containers/settings-sandbox.service';
import { SettingsComponent } from './containers/settings/settings.component';
import { ComponentsModule } from '../../shared/components/index';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    SettingsRoutingModule
  ],
  declarations: [ProfileComponent, SettingsComponent],
  providers: [SettingsSandboxService]
})
export class SettingsModule { }
