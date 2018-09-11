import { BehaviorSubject } from 'rxjs';
import * as feathersAuthenticate from '@feathersjs/authentication-client';
import * as feathersClient from '@feathersjs/client';
import * as feathersSocket from '@feathersjs/socketio-client';
import { Inject, Optional } from '@angular/core';
import * as socketio from 'socket.io-client';

import { BackendConfigClass } from './backend-config.class';
import { BackendConfigToken } from './backend-config.token';

/**
 * Common backend socket IO service base class
 */
export abstract class BackendService {
  protected connectionState: BackendServiceConnectionState = { isConnected: false, attemptNumber: 0, connectionError: '', user: null }
  public connectionState$: BehaviorSubject<BackendServiceConnectionState>; // Service connection state observable
  protected config: BackendConfigClass;
  protected socketio: socketio.Socket = null;

  constructor(config?: BackendConfigClass) {
    // If no config is provided, sets a default one
    if (config == null) this.config = { apiEndPoint: 'http://localhost:3030' };
    this.initSocketClient();
  }

  /**
   * 
   * Abstract method that MUST be implemented in inherited classes
   */
  abstract service(name: string): any
  abstract authenticate(credentials?): Promise<any>
  abstract logout(): Promise<any>
  abstract isAuth(): Promise<boolean>

  private initSocketClient(): void {
    this.socketio = socketio(this.config.apiEndPoint);
    this.initSocketClientHandlers();
  }

  private initSocketClientHandlers(): void {
    this.socketio.on('connect_error', (error) => {
      Object.assign(this.connectionState, { isConnected: false, connectionError: error });
      this.connectionState$.next(this.connectionState);
    });

    this.socketio.on('connect_timeout', (error) => {
      Object.assign(this.connectionState, { isConnected: false, connectionError: error });
      this.connectionState$.next(this.connectionState);
    });

    this.socketio.on('reconnect_attempt', (attempt) => {
      Object.assign(this.connectionState, { isConnected: false, attemptNumber: attempt });
      this.connectionState$.next(this.connectionState);
    })

    this.socketio.on('connect', (status) => {
      Object.assign(this.connectionState, { isConnected: true, connectionError: '', attemptNumber: 0 });
      this.connectionState$.next(this.connectionState);
    });
  }
}

export abstract class BackendServiceConnectionState {
  public isConnected: boolean;
  public attemptNumber: number;
  public connectionError: any;
  public user: any;
}