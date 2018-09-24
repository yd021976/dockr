import {
  AfterViewInit,
  AfterContentInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatIconRegistry,
} from '@angular/material';

import { AppRoute } from '../../../models/app-route.model';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit, AfterViewInit, AfterContentInit {
  @Input() menuItem: AppRoute = {};
  @Input() accordion: MatAccordion = null;
  @ViewChild(MatExpansionPanel) panel: MatExpansionPanel;

  constructor(private matIconRegistry: MatIconRegistry) {
    matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
    matIconRegistry.setDefaultFontSetClass('fa');
  }

  ngOnInit() {

  }

  /*
  Init accordion property to the first expansion panel
  */
  ngAfterViewInit() {
    if (this.accordion) {
      if (this.panel) {
        this.panel.accordion = this.accordion;
      }
    }
  }
  ngAfterContentInit() {

  }

}
