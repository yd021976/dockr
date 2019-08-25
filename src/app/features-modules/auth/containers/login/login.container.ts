import { ActivatedRoute, Router } from '@angular/router';
import { Component, Inject } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';

import { loginCredentials } from '../../../../shared/models/user.model';
import { Subscription, Observable } from 'rxjs';
import { AuthSandboxProviderToken } from '../../sandboxes/auth.sandbox.token';
import { AuthSandboxInterface } from '../../sandboxes/auth.sandbox.interface';

@Component( {
  selector: 'app-login-container',
  templateUrl: './login.container.html',
  styleUrls: [ './login.container.scss' ]
} )
export class LoginContainer implements OnInit, OnDestroy {

  public error$: Observable<string> = this.sandbox.authError$
  private subscribes: Array<Subscription> = []
  private redirectTo: string

  constructor( @Inject( AuthSandboxProviderToken ) public sandbox: AuthSandboxInterface, public route: ActivatedRoute, private router: Router ) {
    this.subscribes = new Array<Subscription>()
  }

  public ngOnInit() {
    /**
     * Get url to redirect to after login success
     */
    this.subscribes.push( this.route
      .queryParams
      .subscribe( params => {
        // Defaults to '' if no query param provided.
        this.redirectTo = params[ 'redirectTo' ] || '/'
      } ) );
  }
  public ngOnDestroy() {
    this.subscribes.forEach( subscription => subscription.unsubscribe() )
  }

  public login( credentials: loginCredentials ): Promise<void> {
    return this.sandbox.Login( credentials )
      .then( ( status ) => {
        if ( status ) this.router.navigate( [ this.redirectTo ] );
        this.sandbox.debug( { message: 'login method success', otherParams: [ status ] } )
      } )
      .catch( ( error ) => {
        this.sandbox.debug( { message: 'login method error', otherParams: [ error ] } )
      } )
  }
}
