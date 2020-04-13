import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

import { HomeRoutingModule } from './home-routing.module';
import { HomeContainer } from './containers/home.container';
import { DashboardSandbox } from './sandboxes/dashboard/dashboard.sandbox.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ComponentsModule } from '../../shared/components/components.module';
import { TodoComponent } from './components/todo/todo.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { dashboardSandboxProviderToken } from './sandboxes/dashboard/dashboard.sandbox.token';
/**
 * 
 */
@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    HomeRoutingModule,
    MatExpansionModule,
    DirectivesModule
  ],
  declarations: [HomeContainer, DashboardComponent, TodoComponent],
  providers: [
    {
      provide: dashboardSandboxProviderToken,
      multi: false,
      useClass: DashboardSandbox
    }
  ]
})
export class HomeModule {
}
