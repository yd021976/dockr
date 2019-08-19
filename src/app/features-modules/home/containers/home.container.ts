import { Component, OnInit } from '@angular/core';
import { DashboardSandbox } from '../sandboxes/dashboard/dashboard.sandbox.service';

@Component( {
  selector: 'app-home',
  templateUrl: './home.container.html',
  styleUrls: [ './home.container.scss' ]
} )
export class HomeContainer implements OnInit {

  constructor( ) { }

  ngOnInit() { }
}
