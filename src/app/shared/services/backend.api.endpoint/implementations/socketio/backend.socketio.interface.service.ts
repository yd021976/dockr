import { BehaviorSubject } from 'rxjs';
import { connect } from 'socket.io-client';
import { BackendBaseServiceInterface } from '../../interfaces/backend.base.service';
import { BackendConfig } from '../../../../models/backend.config.model';
import { BackendConnectionState, BackendStateChangeReasons } from '../../../../models/backend.connection.state.model';
import { AppLoggerService } from '../../../logger/app-logger/service/app-logger.service';

/**
 * Common backend socket IO service base classw
 */
export abstract class BackendSocketioServiceInterface extends BackendBaseServiceInterface {
  protected socketio: SocketIOClient.Socket = null

  /**
   * Constructor
   * @param config Should be provided by inherited class constructor
   */
  constructor( public loggerService: AppLoggerService, config?: BackendConfig ) {
    super( loggerService, config )
    // Init connection state
    this.connectionState = new BackendConnectionState( { isConnected: false, attemptNumber: 0, connectionError: '', user: null } )
    this.connectionState$ = new BehaviorSubject<BackendConnectionState>( this.connectionState )
    this.initSocketClient()
  }

  /**
   * Init Socket IO
   */
  private initSocketClient(): void {
    this.socketio = connect( this.config.apiEndPoint )
    this.initSocketClientHandlers()
  }

  /**
   * Register socket IO events to update connection state
   */
  private initSocketClientHandlers(): void {
    this.socketio.on( 'connect_error', ( error ) => {
      this.updateConnectionState( { isConnected: false, connectionError: error, changeReason: BackendStateChangeReasons.socketIO_Connection_Error } )
    } )

    this.socketio.on( 'connect_timeout', ( error ) => {
      this.updateConnectionState( { isConnected: false, connectionError: error, changeReason: BackendStateChangeReasons.socketIO_connection_timeout } )
    } )

    this.socketio.on( 'reconnect_attempt', ( attempt ) => {
      this.updateConnectionState( { attemptNumber: attempt, changeReason: BackendStateChangeReasons.socketIO_Reconnect_Attempt } )
    } )

    this.socketio.on( 'connect', ( status ) => {
      this.updateConnectionState( { isConnected: true, connectionError: '', attemptNumber: 0, changeReason: BackendStateChangeReasons.socketIO_Connected } )
    } )
  }


  /**
   * Update connection state member and update RXJS stream (subject behavior)
   * 
   * @param newState : New state with ONLY new state values to update
   */
  protected updateConnectionState( newState: BackendConnectionState ) {
    Object.assign( this.connectionState, newState )
    this.connectionState$.next( this.connectionState )
  }
}