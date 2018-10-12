import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoute } from './shared/models/app-route.model';
import { RouterModule } from '@angular/router';


export const routes: AppRoute[] = [
  { path: '', redirectTo: 'home/dashboard', pathMatch: 'full' }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: []
})

export class AppRoutingModule { }
