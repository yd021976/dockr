import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginContainer } from './containers/login/login.component';
import { LogoutContainer } from './containers/logout/logout.component';
import { RegisterContainer } from './containers/register/register.component';

const routes: Routes = [
  {
    path: 'auth', data: { isMenu: false }, children: [
      { path: 'login', component: LoginContainer },
      { path: 'logout', component: LogoutContainer },
      { path: 'register', component: RegisterContainer },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
