import { Component, OnInit, Input } from '@angular/core';
import { AppRoute } from 'src/app/shared/models/app-route.model';

@Component({
  selector: 'app-menu-link',
  templateUrl: './menu-link.component.html',
  styleUrls: ['./menu-link.component.scss']
})
export class MenuLinkComponent implements OnInit {
  @Input() menuItem: AppRoute

  constructor() { }

  ngOnInit() {
  }

}
