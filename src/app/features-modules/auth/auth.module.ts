import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthRoutingModule } from './auth-routing.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { LoginContainer } from './containers/login/login.container';
import { LogoutContainer } from './containers/logout/logout.container';
import { RegisterContainer } from './containers/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { RegisterComponent } from './components/register/register.component';
import { AclService } from './services/acl.service';
import { RolesService } from 'src/app/shared/services/acl/roles/roles.service';
import { PermissionsService } from 'src/app/shared/services/acl/permissions/permissions.service';
import { Ability } from '@casl/ability';
import { AuthSandboxProviderToken } from './sandboxes/auth.sandbox.token';
import { AuthSandbox } from './sandboxes/auth.sandbox';
import { siteZonesServiceToken } from 'src/app/shared/services/site.zones/site.zones.token';
import { SiteZonesService } from 'src/app/shared/services/site.zones/site.zones.service';
import { AppInjectorToken } from 'src/app/main/app.injector.token';

export function createAbility() {
  return new Ability([])
}

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    AuthRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [LoginContainer, LogoutContainer, RegisterContainer, LoginComponent, LogoutComponent, RegisterComponent],
  providers: [
    {
      provide: AuthSandboxProviderToken,
      multi: false,
      useClass: AuthSandbox
    },
    AclService, RolesService,
    { provide: Ability, useFactory: createAbility, multi: false },
    { provide: PermissionsService, deps: [Ability], useValue: undefined }]
})
export class AuthModule { }
