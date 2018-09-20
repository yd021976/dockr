import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { loginCredentials } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public credentials: loginCredentials = { strategy: 'local', email: '', password: '' };
  public AuthError$: Observable<string>;
  private subscribes: Array<Subscription>;
  private redirectTo: string;

  constructor(private router: Router, public route: ActivatedRoute) { }

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


  public onLogin() { }
}
