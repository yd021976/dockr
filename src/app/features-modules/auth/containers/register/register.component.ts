import { Component, OnInit, Inject } from '@angular/core';
import { AuthSandboxProviderToken } from '../../sandboxes/auth.sandbox.token';
import { AuthSandboxInterface } from '../../sandboxes/auth.sandbox.interface';

@Component( {
  selector: 'app-register-container',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.scss' ]
} )
export class RegisterContainer implements OnInit {

  constructor( @Inject( AuthSandboxProviderToken ) public sandbox: AuthSandboxInterface ) { }

  ngOnInit() {
  }

}
