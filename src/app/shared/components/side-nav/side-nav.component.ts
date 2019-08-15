import { Component, OnInit, Input } from '@angular/core';

// App Types
import { ApplicationRouteInterface } from '../../models/application.route.model';


@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  // @ViewChild(MatAccordion) accordion:MatAccordion;

  // Convert router config to simplified 2 levels array of route items (avoid multiple ng-container loop/if in template)
  @Input() routerConfig: ApplicationRouteInterface[];

  constructor() { }
  ngOnInit() { }

}