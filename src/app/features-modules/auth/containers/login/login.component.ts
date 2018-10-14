import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { loginCredentials } from '../../../../shared/models/user.model';
import { AuthSandbox } from '../auth.sandbox';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private readonly loggerName: string = "LoginComponent";

  public credentials: loginCredentials = { strategy: 'local', email: '', password: '' };
  public authError$: Observable<string>;
  private subscribes: Array<Subscription>;
  private redirectTo: string;

  constructor(public sandbox: AuthSandbox, public route: ActivatedRoute, private router: Router) {
    this.subscribes = new Array<Subscription>();
    this.authError$ = this.sandbox.authError$;
  }

  public ngOnInit() {
    /**
     * Get url to redirect to after login success
     */
    this.subscribes.push(this.route
      .queryParams
      .subscribe(params => {
        // Defaults to '' if no query param provided.
        this.redirectTo = params['redirectTo'] || '/';
      }));
  }


  public onLogin() {
    this.sandbox.Login(this.credentials).then((result) => {
      if (result) {
        this.sandbox.loggerService.debug(this.loggerName, { message: 'onLogin()', otherParams: ['successfull', 'redirecting', this.redirectTo] });
        this.router.navigate([this.redirectTo]);
      }
    })
  }
}
