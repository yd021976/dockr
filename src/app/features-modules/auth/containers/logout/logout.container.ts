import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthSandbox } from '../../auth.sandbox';

@Component({
  selector: 'app-logout-container',
  templateUrl: './logout.container.html',
  styleUrls: ['./logout.container.scss']
})
export class LogoutContainer implements OnInit, OnDestroy {
  private readonly loggerName: string = 'LogoutContainer'

  constructor(public sandbox: AuthSandbox) {
    this.sandbox.loggerService.createLogger(this.loggerName)
  }

  ngOnInit() { }

  ngOnDestroy() { }

  onLogout() {
    this.sandbox.logout();
  }
}
