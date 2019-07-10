import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthSandbox } from './auth.sandbox';
import { ComponentsModule } from 'src/app/shared/components';
import { LoginContainer } from './containers/login/login.container';
import { LogoutContainer } from './containers/logout/logout.container';
import { RegisterContainer } from './containers/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { RegisterComponent } from './components/register/register.component';
import { AclService } from './services/acl.service';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    AuthRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [LoginContainer, LogoutContainer, RegisterContainer, LoginComponent,LogoutComponent,RegisterComponent],
  providers: [AuthSandbox, AclService]
})
export class AuthModule { }
