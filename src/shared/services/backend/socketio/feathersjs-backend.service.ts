import { Inject, Injectable, Optional } from '@angular/core';
import * as feathersClient from '@feathersjs/client';
import * as feathersAuthenticate from '@feathersjs/authentication-client';
import * as feathersSocket from '@feathersjs/socketio-client';
import * as feathersHooks from '@feathersjs/commons';
import { BehaviorSubject } from 'rxjs';

import { BackendService, BackendServiceConnectionState } from './backend-base.service';
import { BackendConfigToken } from './backend-config.token';
import { BackendConfigClass } from './backend-config.class';

@Injectable({
  providedIn: 'root'
})

export class FeathersjsBackendService extends BackendService {

  private feathers: feathersClient.Application = null;

  private currentCounter: number = 0; // For debug purpose ONLY ==> Copy of static "count" property
  static count: number = 0; // Class instances count


  constructor(@Optional() @Inject(BackendConfigToken) config: BackendConfigClass) {
    super(config);

    // Init Behavior subject for connection state
    this.connectionState
    this.connectionState$ = new BehaviorSubject<BackendServiceConnectionState>(this.connectionState);

    // Class instance count 
    FeathersjsBackendService.count++;
    this.currentCounter = FeathersjsBackendService.count;
    this.configureFeathers();
  }

  private configureFeathers() {
    this.feathers = feathersClient()
      .configure(feathersSocket(this.socketio))
      .configure(feathersHooks.hooks())
      .configure(feathersAuthenticate({
        storage: window.localStorage
      }));

    this.feathers.on('authenticated', (event) => {
      Object.assign(this.connectionState, { user: this.feathers.get('user') });
      this.connectionState$.next(this.connectionState);
    });
    this.feathers.on('logout', (event) => {
      // Clear current user
      this.feathers.set('user', null);
      Object.assign(this.connectionState, { user: null });
      this.connectionState$.next(this.connectionState);
    });

    this.feathers.on('reauthentication-error', (event) => {
      if (event.data.name == 'TokenExpiredError') {
        const user = this.feathers.get('user');
        // if token has expired and user was anonymous, just auth again as anonymous
        if (user['anonymous']) this.authenticate({ strategy: 'anonymous' })
          .then(user => {
            this.feathers.set('user', user)
          })
          .catch(error => {
            Object.assign(this.connectionState, { user: null });
            this.connectionState$.next(this.connectionState);
          });
      }
    });
  }

  public service(name: string): feathersClient.Service<any> {
    return this.feathers.service(name);
  }

  /**
   * Authenticate user and sets <user> property of this service
   */
  public authenticate(credentials?): Promise<any> {
    return this.feathers.authenticate(credentials ? credentials : {})
      .then(response => {
        return this.feathers.passport.verifyJWT(response.accessToken)
      })
      .then((payload: any) => {
        return this.feathers.service('users').get(payload.userId);
      })
      .then(user => {
        this.feathers.set('user', user);
        return user;
      })
  }

  public logout(): Promise<any> {
    return this.feathers.logout();
  }

  /** 
   * Check if user is authenticated.
   * 
   * NOTE : 
   * - For anonymous users, return FALSE
   * - You must authenticate if user is authenticated, this method DO NOT authenticated user even if payload is valid !!!
  */
  public isAuth(): Promise<boolean> {
    var isAuth = false, jwt = null, jwt_data = '';

    return new Promise((resolve, reject) => {
      this.feathers.passport.getJWT()
        .then((token) => {
          jwt = token;
          if (jwt !== null && jwt !== undefined) {
            this.feathers.passport.verifyJWT(jwt)
              .then((data) => {
                jwt_data = data;
                isAuth = this.feathers.passport.payloadIsValid(jwt);
                resolve(isAuth);
              })
              .catch(error => resolve(isAuth))
          } else {
            resolve(isAuth);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
