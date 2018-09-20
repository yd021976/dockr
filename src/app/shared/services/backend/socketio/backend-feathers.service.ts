import { Inject, Injectable, Optional } from '@angular/core';
import * as feathers from '@feathersjs/feathers';
import * as feathersAuthenticate from '@feathersjs/authentication-client';
import * as feathersSocket from '@feathersjs/socketio-client';
// import * as feathersHooks from '@feathersjs/commons';
import { BehaviorSubject } from 'rxjs';

import { BackendSocketioService } from './backend-socketio.service';
import { BackendServiceConnectionState, stateChangeReason } from '../../../models/backend-service-connection-state.model';
import { BackendConfigToken } from '../backend-config.token';
import { BackendConfigClass } from '../../../models/backend-config.class';

@Injectable({
  providedIn: 'root'
})
export class FeathersjsBackendService extends BackendSocketioService {

  private feathers: feathers.Application = null;

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
    this.feathers = feathers();

    this.feathers
      .configure(feathersSocket(this.socketio))
      // .configure(feathersHooks.hooks())
      .configure(feathersAuthenticate({
        storage: window.localStorage
      }));

    this.feathers.on('authenticated', (event) => {
      return this.feathers.passport.verifyJWT(event.accessToken)
        .then((payload => {
          return this.feathers.service('users').get(payload.userId);
        }))
        .then((user) => {
          this.feathers.set('user', user);
          this.updateConnectionState({ user: this.feathers.get('user'), changeReason: stateChangeReason.Feathers_Authenticated });
        })
    });
    this.feathers.on('logout', (event) => {
      // Clear current user
      this.feathers.set('user', null);
      this.updateConnectionState({ user: null, changeReason: stateChangeReason.Feathers_Logout });
    });

    this.feathers.on('reauthentication-error', (event) => {
      if (event.data.name == 'TokenExpiredError') {
        const user = this.feathers.get('user'); // Get current logged in user
        // if token has expired and user was anonymous, just auth again as anonymous else logout user and auth as anonymous
        if (user['anonymous']) {
          return this.authenticate({ strategy: 'anonymous' })
        } else {
          return this.logout().then(() => this.authenticate({ strategy: 'anonymous' }));
        }
      }
    });
  }

  public service(name: string): feathers.Service<any> {
    return this.feathers.service(name);
  }

  /**
   * Authenticate user and sets <user> property of this service
   */
  public authenticate(credentials?): Promise<any> {
    return this.feathers.authenticate(credentials ? credentials : {})
      // .then(response => {
      //   return this.feathers.passport.verifyJWT(response.accessToken)
      // })
      // .then((payload: any) => {
      //   return this.feathers.service('users').get(payload.userId);
      // })
      // .then(user => {
      //   this.feathers.set('user', user);
      //   return user;
      // })
  }

  public logout(): Promise<any> {
    return this.feathers.logout();
  }

  /** 
   * Check if user is authenticated.
   * 
   * NOTE : 
   * - For anonymous users, resolve FALSE
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
