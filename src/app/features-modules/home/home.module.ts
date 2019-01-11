import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './containers/home/home.component';
import { DashboardSandbox } from '../../shared/sandboxes/containers/dashboard-sandbox.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ComponentsModule } from '../../shared/components';
import { TodoComponent } from './components/todo/todo.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AclZoneComponent,AclZoneBlankComponent } from './components/dashboard/acl-zone/acl-zone.component';
import { AclZoneElementComponent } from './components/dashboard/acl-zone-element/acl-zone-element.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    HomeRoutingModule,
    MatExpansionModule,
    NgxPermissionsModule
  ],
  declarations: [HomeComponent, DashboardComponent, TodoComponent, AclZoneComponent, AclZoneElementComponent,AclZoneBlankComponent],
  providers: [
    DashboardSandbox
  ]
})
export class HomeModule {
 }
