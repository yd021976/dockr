import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Routes, Route } from '@angular/router';

// App Types
import { AppRoute } from '../../models/app-route.model';
import { MatAccordion } from '@angular/material';


@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @ViewChild(MatAccordion) accordion:MatAccordion;

  // Convert router config to simplified 2 levels array of route items (avoid multiple ng-container loop/if in template)
  @Input() routerConfig: AppRoute[];

  constructor() { }
  ngOnInit() { }

}