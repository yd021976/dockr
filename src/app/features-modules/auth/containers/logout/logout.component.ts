import { Component, OnInit } from '@angular/core';
import { AuthSandbox } from '../../auth.sandbox';

@Component({
  selector: 'app-logout-container',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutContainer implements OnInit {

  constructor(public sandbox: AuthSandbox) { }

  ngOnInit() {
  }
  onLogout() {
    this.sandbox.logout();
  }
}
