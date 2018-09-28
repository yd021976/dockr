import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { DashboardSandbox } from '../../shared/sandboxes/containers/sandbox-dashboard.service';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  declarations: [DashboardComponent],
  providers:[
    DashboardSandbox
  ]
})
export class HomeModule { }
