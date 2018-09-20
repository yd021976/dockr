import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {MatFormFieldModule, MatInputModule} from '@angular/material';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './containers/login/login.component';
import { LogoutComponent } from './containers/logout/logout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoginRoutingModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [LoginComponent, LogoutComponent]
})
export class LoginModule { }
