/**
 * Connection state class
 */
export class BackendServiceConnectionState {
    public isConnected?: boolean;
    public attemptNumber?: number;
    public connectionError?: any;
    public user?: any;

    constructor(state?: { isConnected?: boolean, attemptNumber?: number, connectionError?: any, user?: any }) {
        Object.assign(this, state);
    }
}