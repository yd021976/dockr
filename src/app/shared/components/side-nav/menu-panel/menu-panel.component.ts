import { Component, OnInit, Input } from '@angular/core';
import { AppRoute } from 'src/app/shared/models/app-route.model';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-menu-panel',
  templateUrl: './menu-panel.component.html',
  styleUrls: ['./menu-panel.component.scss']
})
export class MenuPanelComponent implements OnInit {
  @Input() menuItem: AppRoute = {}

  constructor(private matIconReg: MatIconRegistry) {
    matIconReg.registerFontClassAlias('fontawesome solid', 'fas');
    matIconReg.registerFontClassAlias('fontawesome regular', 'far');
    matIconReg.setDefaultFontSetClass('fas');
  }

  ngOnInit() {
  }

}
