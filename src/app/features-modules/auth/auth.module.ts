import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './containers/login/login.component';
import { LogoutComponent } from './containers/logout/logout.component';
import { AuthSandbox } from './containers/auth.sandbox';
import { RegisterComponent } from './containers/register/register.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [LoginComponent, LogoutComponent, RegisterComponent],
  providers: [AuthSandbox]
})
export class AuthModule { }
