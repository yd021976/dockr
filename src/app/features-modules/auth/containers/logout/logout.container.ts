import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { AuthSandboxProviderToken } from '../../sandboxes/auth.sandbox.token';
import { AuthSandboxInterface } from '../../sandboxes/auth.sandbox.interface';

@Component( {
  selector: 'app-logout-container',
  templateUrl: './logout.container.html',
  styleUrls: [ './logout.container.scss' ]
} )
export class LogoutContainer implements OnInit, OnDestroy {

  constructor( @Inject( AuthSandboxProviderToken ) public sandbox: AuthSandboxInterface ) {
  }

  ngOnInit() { }

  ngOnDestroy() { }

  onLogout() {
    this.sandbox.logout();
  }
}
