import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './containers/home/home.container';
import { DashboardSandbox } from '../../shared/sandboxes/containers/dashboard-sandbox.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ComponentsModule } from '../../shared/components/components.module';
import { TodoComponent } from './components/todo/todo.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';

/**
 * 
 */
@NgModule( {
  imports: [
    CommonModule,
    ComponentsModule,
    HomeRoutingModule,
    MatExpansionModule,
    NgxPermissionsModule,
    DirectivesModule
  ],
  declarations: [ HomeComponent, DashboardComponent, TodoComponent ],
  providers: [
    DashboardSandbox
  ]
} )
export class HomeModule {
}
