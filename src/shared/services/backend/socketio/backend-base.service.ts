import { BehaviorSubject } from 'rxjs';
import * as socketio from 'socket.io-client';

import { BackendConfigClass } from './backend-config.class';

/**
 * Connection state class
 */
export abstract class BackendServiceConnectionState {
  public isConnected?: boolean;
  public attemptNumber?: number;
  public connectionError?: any;
  public user?: any;
}

/**
 * Common backend socket IO service base class
 */
export abstract class BackendService {
  protected connectionState: BackendServiceConnectionState;
  public connectionState$: BehaviorSubject<BackendServiceConnectionState>; // Service connection state observable
  protected config: BackendConfigClass;
  protected socketio: socketio.Socket = null;

  /**
   * Constructor
   * @param config Should be provided by inherited class constructor
   */
  constructor(config?: BackendConfigClass) {
    // If no config is provided, sets a default one
    if (config == null) this.config = { apiEndPoint: 'http://localhost:3030' };

    // Init connection state
    this.updateConnectionState({ isConnected: false, attemptNumber: 0, connectionError: '', user: null });
    this.initSocketClient();
  }

  /**
   * Get an instance to a service provided by the backend
   * @param name Service name
   */
  abstract service(name: string): any

  /**
   * Authenticate a user
   * @param credentials Credentials required by implemented backend
   */
  abstract authenticate(credentials?: any): Promise<any>

  /**
   * Logout a user
   */
  abstract logout(): Promise<any>

  /**
   * Check if a user is actually authenticated
   */
  abstract isAuth(): Promise<boolean>

  /**
   * Init Socket IO
   */
  private initSocketClient(): void {
    this.socketio = socketio(this.config.apiEndPoint);
    this.initSocketClientHandlers();
  }

  /**
   * Register socket IO events to update connection state
   */
  private initSocketClientHandlers(): void {
    this.socketio.on('connect_error', (error) => {
      this.updateConnectionState({ isConnected: false, connectionError: error });
    });

    this.socketio.on('connect_timeout', (error) => {
      this.updateConnectionState({ isConnected: false, connectionError: error });
    });

    this.socketio.on('reconnect_attempt', (attempt) => {
      this.updateConnectionState({ isConnected: false, attemptNumber: attempt });
    })

    this.socketio.on('connect', (status) => {
      this.updateConnectionState({ isConnected: true, connectionError: '', attemptNumber: 0 });
    });
  }


  /**
   * Update connection state member and update RXJS stream (subject behavior)
   * 
   * @param newState : New state with ONLY new state values to update
   */
  private updateConnectionState(newState: BackendServiceConnectionState) {
    Object.assign(this.connectionState, newState);
    this.connectionState$.next(this.connectionState);
  }
}