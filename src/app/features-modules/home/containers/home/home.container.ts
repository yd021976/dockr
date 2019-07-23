import { Component, OnInit } from '@angular/core';
import { DashboardSandbox } from '../../../../shared/sandboxes/containers/dashboard-sandbox.service';

@Component( {
  selector: 'app-home',
  templateUrl: './home.container.html',
  styleUrls: [ './home.container.scss' ]
} )
export class HomeComponent implements OnInit {

  constructor( public sandbox: DashboardSandbox ) { }

  ngOnInit() { }
}
