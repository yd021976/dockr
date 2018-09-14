import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { ThemeItem } from '../../models/theme-items.model';



@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @Input() themes: ThemeItem[] = [];
  @Input() isAuthenticated: boolean; // Is a user authenticated ?
  @Output() themeChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() logout: EventEmitter<any> = new EventEmitter<any>();
  @Output() login: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onLogout() {
    this.logout.emit();
  }

  onLogin() {
    this.login.emit();
  }

}
