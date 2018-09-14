/**
 * Connection state class
 */
export abstract class BackendServiceConnectionState {
    public isConnected?: boolean;
    public attemptNumber?: number;
    public connectionError?: any;
    public user?: any;
}