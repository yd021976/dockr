import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { loginCredentials } from '../../../../shared/models/user.model';
import { LoginSandbox } from '../login.sandbox';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public credentials: loginCredentials = { strategy: 'local', email: '', password: '' };
  public authError$: Observable<string>;
  private subscribes: Array<Subscription>;
  private redirectTo: string;

  constructor(public sandbox:LoginSandbox, public route: ActivatedRoute) {
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
    this.sandbox.Login(this.credentials);
  }
}
