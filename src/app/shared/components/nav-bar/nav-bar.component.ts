import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { ThemeItem } from '../../models/theme-items.model';
import { UserModel } from '../../models/user.model';



@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @Input() themes: ThemeItem[] = [];
  @Input() isAuthenticated: boolean; // Is a user authenticated ?
  @Input() isProgress: boolean; // Is something in progress ?
  @Input() user: UserModel; // Current logged in user
  @Output() themeChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() logout: EventEmitter<any> = new EventEmitter<any>();
  @Output() login: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  onLogout() {
    this.logout.emit();
  }

  onLogin() {
    this.login.emit();
  }

}
