import { BehaviorSubject } from 'rxjs';
import * as feathers from '@feathersjs/feathers';
import * as feathersAuthenticate from '@feathersjs/authentication-client';
import * as feathersSocket from '@feathersjs/socketio-client';
import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Optional } from '@angular/core';


import { BackendSocketioService } from './backend-socketio.service';
import { stateChangeReason } from '../../../models/backend-service-connection-state.model';
import { BackendConfigToken } from '../backend-config.token';
import { BackendConfigClass } from '../../../models/backend-config.model';
import { loginCredentials } from '../../../models/user.model';
import { AppLoggerServiceToken } from '../../logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../logger/app-logger/service/app-logger.service';

@Injectable( {
  providedIn: 'root'
} )
/**
 * IMPORTANT: Current/last logged in user is a property sets in "feathers" object
 */
export class FeathersjsBackendService extends BackendSocketioService {
  private readonly loggerName: string = "FeathersjsBackendService";

  private feathers: feathers.Application = null;
  private currentCounter: number = 0; // For debug purpose ONLY ==> Copy of static "count" property
  static count: number = 0; // Class instances count

  constructor(
    @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerService,
    @Optional() @Inject( BackendConfigToken ) config: BackendConfigClass ) {
    super( loggerService, config );
    // Register a new logger name
    this.loggerService.createLogger( this.loggerName );

    // Class instance count 
    FeathersjsBackendService.count++;
    this.currentCounter = FeathersjsBackendService.count;
    this.configureFeathers();
  }

  private configureFeathers() {
    this.feathers = feathers.default()

    this.feathers
      .configure( feathersSocket( this.socketio ) )
      .configure( feathersAuthenticate.default( {
        storage: window.localStorage
      } ) );


    /**
     * Event when user logs out
     */
    this.feathers.service( 'authentication' ).on( 'logout-user', ( data ) => {
      this.updateConnectionState( { attemptNumber: 0, changeReason: stateChangeReason.Feathers_Token_Expired } )
      this.feathers.set( 'user', null )
    } )

    this.feathers.on( 'reauthentication-error', ( event ) => {
      this.loggerService.debug( this.loggerName, {
        message: 'reauthentication-error', otherParams: [ event ]
      } );


      if ( event[ 'data' ] && event[ 'data' ][ 'name' ] == 'TokenExpiredError' ) {
        // IMPORTANT: We don't clear "user" property here. We need to keep track of last loggedin user, even after auth error or deconnexion
        this.updateConnectionState( { changeReason: stateChangeReason.Feathers_reauthentication_error } );
      }
    } );
  }
  public getCurrentUser(): any {
    return this.feathers.get( 'user' );
  }
  public service( name: string ): feathers.Service<any> {
    return this.feathers.service( name );
  }

  /**
   * Authenticate user and sets <user> property of this service
   * Note : As event "authenticated" will be trigerred in this method, the user data will be fetched twice. @see configureFeathers
   */
  public authenticate( credentials?: loginCredentials ): Promise<any> {
    this.loggerService.debug( this.loggerName, { message: 'authenticate()', otherParams: [ 'START', credentials ] } );
    return this.feathers.authenticate( credentials )
      .then( response => {
        this.loggerService.debug( this.loggerName, { message: 'authenticate()', otherParams: [ 'PROGRESS', 'STEP-1', response ] } );
        return this.feathers.passport.verifyJWT( response.accessToken )
      } )
      .then( ( payload: any ) => {
        this.loggerService.debug( this.loggerName, { message: 'authenticate()', otherParams: [ 'PROGRESS', 'STEP-2', payload ] } );
        return this.feathers.service( 'users' ).get( payload.userId );
      } )
      .then( user => {
        this.loggerService.debug( this.loggerName, { message: 'authenticate()', otherParams: [ 'END', 'OK', user ] } );
        this.feathers.set( 'user', user );
        return user;
      } )
      .catch( ( error ) => {
        throw error;
      } )
  }

  public logout(): Promise<any> {
    // Clear current user
    this.feathers.set( 'user', null );
    this.updateConnectionState( { changeReason: stateChangeReason.Feathers_Logout } );

    return this.feathers.logout();
  }

  /** 
   * Check if user is authenticated against JWT
   * 
   * NOTE : 
   * - You must authenticate if user is authenticated, this method DO NOT authenticated user even if payload is valid !!!
  */
  public isAuth(): Promise<boolean> {
    var isAuth = false, jwt = null, jwt_data = '';

    return new Promise( ( resolve, reject ) => {
      this.feathers.passport.getJWT()
        .then( ( token ) => {
          jwt = token;
          if ( jwt !== null && jwt !== undefined ) {
            this.feathers.passport.verifyJWT( jwt )
              .then( ( data ) => {
                jwt_data = data;
                isAuth = this.feathers.passport.payloadIsValid( jwt );
                resolve( isAuth );
              } )
              .catch( error => resolve( isAuth ) )
          } else {
            resolve( isAuth );
          }
        } )
        .catch( () => {
          resolve( isAuth );
        } );
    } );
  }
}
