export enum stateChangeReason {
    socketIO_Connection_Error,
    socketIO_connection_timeout,
    socketIO_Reconnect_Attempt,
    socketIO_Connected,
    Feathers_Authenticated,
    Feathers_Logout,
    Feathers_reauthentication_error
}

/**
 * Connection state class
 */
export class BackendServiceConnectionState {
    public isConnected?: boolean;
    public attemptNumber?: number;
    public connectionError?: any;
    public changeReason?: stateChangeReason;

    constructor(state?: { isConnected?: boolean, attemptNumber?: number, connectionError?: any, user?: any, changeReason?: string }) {
        Object.assign(this, state);
    }
}