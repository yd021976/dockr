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

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    HomeRoutingModule,
    MatExpansionModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [HomeComponent, DashboardComponent, TodoComponent],
  providers: [
    DashboardSandbox
  ]
})
export class HomeModule {
 }
