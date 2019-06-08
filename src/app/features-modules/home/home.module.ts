import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './containers/home/home.component';
import { DashboardSandbox } from '../../shared/sandboxes/containers/dashboard-sandbox.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ComponentsModule } from '../../shared/components';
import { TodoComponent } from './components/todo/todo.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AclZoneComponent } from './components/dashboard/acl-zone/acl-zone.component';
import { AclZoneElementComponent } from './components/dashboard/acl-zone-element/acl-zone-element.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    HomeRoutingModule,
    MatExpansionModule,
    NgxPermissionsModule
  ],
  declarations: [HomeComponent, DashboardComponent, TodoComponent, AclZoneComponent, AclZoneElementComponent],
  providers: [
    DashboardSandbox
  ]
})
export class HomeModule {
}
