import init_Feathers_Application, { Application, Service } from '@feathersjs/feathers';
import init_Feathers_AuthClient from '@feathersjs/authentication-client';
import init_Feathers_Socket from '@feathersjs/socketio-client';
import { AuthenticationResult } from '@feathersjs/authentication';
import { Inject, Injectable } from '@angular/core';
import { Optional } from '@angular/core';
import { BackendSocketioServiceInterface } from '../../../implementations/socketio/backend.socketio.interface.service';
import { BackendStateChangeReasons } from '../../../../../models/backend.connection.state.model';
import { BackendConfigToken } from '../../../interfaces/backend.config.token';
import { BackendConfig } from '../../../../../models/backend.config.model';
import { loginCredentials } from '../../../../../models/user.model';
import { AppLoggerServiceToken } from '../../../../logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../../../logger/app-logger/service/app-logger.service';

@Injectable()
/**
 * IMPORTANT: Current/last logged in user is a property sets in "feathers" object
 */
export class FeathersjsBackendService extends BackendSocketioServiceInterface {
  private readonly loggerName: string = "FeathersjsBackendService";

  private feathers: Application = null;
  private currentCounter: number = 0; // For debug purpose ONLY ==> Copy of static "count" property
  static count: number = 0; // Class instances count

  constructor(
    @Inject(AppLoggerServiceToken) public loggerService: AppLoggerService,
    @Optional() @Inject(BackendConfigToken) config: BackendConfig) {
    super(loggerService, config);
    // Register a new logger name
    this.loggerService.createLogger(this.loggerName);

    // Class instance count 
    FeathersjsBackendService.count++;
    this.currentCounter = FeathersjsBackendService.count;
    this.configureFeathers();
  }

  private configureFeathers() {
    this.feathers = init_Feathers_Application()

    this.feathers
      .configure(init_Feathers_Socket(this.socketio))
      .configure(init_Feathers_AuthClient());

    /**
     * Event when user logs out
     */
    this.feathers.service('authentication').on('user-token-expired', (data) => {
      this.updateConnectionState({ attemptNumber: 0, changeReason: BackendStateChangeReasons.Feathers_Token_Expired })
      // Remove token from storage
      this.feathers.authentication.removeAccessToken().then((status)=>{
        return this.feathers.authentication.reset()
      })
      this.feathers.set('user', null)
    })

    this.feathers.on('reauthentication-error', (event) => {
      this.loggerService.debug(this.loggerName, {
        message: 'reauthentication-error', otherParams: [event]
      });


      if (event['data'] && event['data']['name'] == 'TokenExpiredError') {
        // IMPORTANT: We don't clear "user" property here. We need to keep track of last loggedin user, even after auth error or deconnexion
        this.updateConnectionState({ changeReason: BackendStateChangeReasons.Feathers_reauthentication_error });
      }
    });
  }
  public getCurrentUser(): any {
    return this.feathers.get('user');
  }
  public service(name: string): Service<any> {
    return this.feathers.service(name);
  }

  /**
   * Authenticate user and sets <user> property of this service
   * Note : As event "authenticated" will be trigerred in this method, the user data will be fetched twice. @see configureFeathers
   */
  public authenticate(credentials?: loginCredentials): Promise<AuthenticationResult> {
    this.loggerService.debug(this.loggerName, { message: 'authenticate()', otherParams: ['START', credentials] });
    return this.feathers.authenticate(credentials)
      .then((authentication_data) => {
        this.feathers.set('user', authentication_data.user);
        return authentication_data;
      })
      .catch((error) => {
        throw error;
      })
  }

  /**
   * 
   */
  public reAuthenticate(): Promise<AuthenticationResult> {
    return this.feathers.reAuthenticate()
  }


  public async logout(): Promise<any> {
    // Check if a user is authenticated. If no, no need to call logout again
    return this._getAuthenticationData()
      .then((auth_data: AuthenticationResult) => {
        if (auth_data === undefined) return // if no authenticated user, do not call logout because unecessary and generate a feathersbackend exception (@see issue #1905 https://github.com/feathersjs/feathers/issues/1905)
        this.updateConnectionState({ changeReason: BackendStateChangeReasons.Feathers_Logout });
        return this.feathers.logout();
      })
      .catch((err) => {
        throw err
      })
  }

  private _getAuthenticationData(): Promise<AuthenticationResult> {
    return this.feathers.get('authentication') || Promise.resolve(undefined)
  }
}
