import { BehaviorSubject } from 'rxjs';
import * as socketio from 'socket.io-client';

import { BackendBaseService } from '../backend-base.service';
import { BackendConfigClass } from '../../../models/backend-config.class';
import { BackendServiceConnectionState, stateChangeReason } from '../../../models/backend-service-connection-state.model';

/**
 * Common backend socket IO service base class
 */
export abstract class BackendSocketioService extends BackendBaseService {
  protected connectionState: BackendServiceConnectionState;
  public connectionState$: BehaviorSubject<BackendServiceConnectionState>; // Service connection state observable
  protected socketio: socketio.Socket = null;

  /**
   * Constructor
   * @param config Should be provided by inherited class constructor
   */
  constructor(config?: BackendConfigClass) {
    super(config);

    // Init connection state
    this.connectionState = new BackendServiceConnectionState({ isConnected: false, attemptNumber: 0, connectionError: '', user: null });
    this.connectionState$ = new BehaviorSubject<BackendServiceConnectionState>(this.connectionState);
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
      this.updateConnectionState({ isConnected: false, connectionError: error, user: null, changeReason: stateChangeReason.socketIO_Connection_Error });
    });

    this.socketio.on('connect_timeout', (error) => {
      this.updateConnectionState({ isConnected: false, connectionError: error, user: null, changeReason: stateChangeReason.socketIO_connection_timeout });
    });

    this.socketio.on('reconnect_attempt', (attempt) => {
      this.updateConnectionState({ attemptNumber: attempt, changeReason: stateChangeReason.socketIO_Reconnect_Attempt });
    })

    this.socketio.on('connect', (status) => {
      this.updateConnectionState({ isConnected: true, connectionError: '', attemptNumber: 0, changeReason: stateChangeReason.socketIO_Connected });
    });
  }


  /**
   * Update connection state member and update RXJS stream (subject behavior)
   * 
   * @param newState : New state with ONLY new state values to update
   */
  protected updateConnectionState(newState: BackendServiceConnectionState) {
    Object.assign(this.connectionState, newState);
    this.connectionState$.next(this.connectionState);
  }
}