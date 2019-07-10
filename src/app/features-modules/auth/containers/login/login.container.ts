import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';

import { loginCredentials } from '../../../../shared/models/user.model';
import { Subscription, Observable } from 'rxjs';
import { AuthSandbox } from '../../auth.sandbox';

@Component({
  selector: 'app-login-container',
  templateUrl: './login.container.html',
  styleUrls: ['./login.container.scss']
})
export class LoginContainer implements OnInit, OnDestroy {

  private readonly loggerName: string = "LoginContainer";
  public error$: Observable<string> = this.sandbox.authError$
  private subscribes: Array<Subscription> = []
  private redirectTo: string

  constructor(public sandbox: AuthSandbox, public route: ActivatedRoute, private router: Router) {
    this.subscribes = new Array<Subscription>()
    this.sandbox.loggerService.createLogger(this.loggerName)
  }

  public ngOnInit() {
    /**
     * Get url to redirect to after login success
     */
    this.subscribes.push(this.route
      .queryParams
      .subscribe(params => {
        // Defaults to '' if no query param provided.
        this.redirectTo = params['redirectTo'] || '/'
      }));
  }
  public ngOnDestroy() {
    this.subscribes.forEach(subscription => subscription.unsubscribe())
  }

  public login(credentials: loginCredentials):Promise<void> {
    return this.sandbox.Login(credentials)
      .then((status) => {
        if (status) this.router.navigate([this.redirectTo]);
        this.sandbox.loggerService.debug(this.loggerName, { message: 'login method success', otherParams: [status] })
      })
      .catch((error) => {
        this.sandbox.loggerService.debug(this.loggerName, { message: 'login method error', otherParams: [error] })
      })
  }
}
