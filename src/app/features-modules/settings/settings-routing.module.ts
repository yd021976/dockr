import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoute } from '../../shared/models/app-route.model';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './containers/settings/settings.component';


const routes: AppRoute[] = [
  {
    path: 'settings', component: SettingsComponent, data: { isMenu: true, title: 'Settings', icon: 'fa-wrench' }, children: [
      { path: 'profile', component: ProfileComponent, data: { isMenu: true, link: 'settings/profile', title: 'User profile' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
