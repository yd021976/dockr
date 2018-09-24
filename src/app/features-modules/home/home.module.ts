import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './containers/dashboard/dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  declarations: [DashboardComponent]
})
export class HomeModule { }
