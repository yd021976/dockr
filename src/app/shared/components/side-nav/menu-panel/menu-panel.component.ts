import { Component, OnInit, Input } from '@angular/core';
import { ApplicationRouteInterface } from 'src/app/shared/models/application.route.model';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-menu-panel',
  templateUrl: './menu-panel.component.html',
  styleUrls: ['./menu-panel.component.scss']
})
export class MenuPanelComponent implements OnInit {
  @Input() menuItem: ApplicationRouteInterface = {}

  constructor(private matIconReg: MatIconRegistry) {
    matIconReg.registerFontClassAlias('fontawesome solid', 'fas');
    matIconReg.registerFontClassAlias('fontawesome regular', 'far');
    matIconReg.setDefaultFontSetClass('fas');
  }

  ngOnInit() {
  }

}
