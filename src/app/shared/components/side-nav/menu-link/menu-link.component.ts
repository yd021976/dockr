import { Component, OnInit, Input } from '@angular/core';
import { ApplicationRouteInterface } from 'src/app/shared/models/application.route.model';

@Component({
  selector: 'app-menu-link',
  templateUrl: './menu-link.component.html',
  styleUrls: ['./menu-link.component.scss']
})
export class MenuLinkComponent implements OnInit {
  @Input() menuItem: ApplicationRouteInterface = null

  constructor() { }

  ngOnInit() {
  }

}
