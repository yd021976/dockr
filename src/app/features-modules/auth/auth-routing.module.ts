import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './containers/login/login.component';
import { LogoutComponent } from './containers/logout/logout.component';
import { RegisterComponent } from './containers/register/register.component';

const routes: Routes = [
  {
    path: 'auth', children: [
      { path: 'login', component: LoginComponent },
      { path: 'logout', component: LogoutComponent },
      { path: 'register', component: RegisterComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
