import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoute } from '../../shared/models/app-route.model';
import { ProfileComponent } from './containers/profile/profile.component';


const routes: AppRoute[] = [
  {
    path: 'settings', data: { isMenu: true, title: 'Settings', icon: 'fa-wrench' }, children: [
      { path: 'profile', component: ProfileComponent, data: { isMenu: true, link: 'settings/profile', title: 'User profile' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
