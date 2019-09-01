import { Inject } from '@angular/core';
import { BackendConfig } from '../../../models/backend.config.model';

import { AppLoggerServiceToken } from '../../logger/app-logger/app-logger-token';
import { BackendConnectionState } from 'src/app/shared/models/backend.connection.state.model';
import { BehaviorSubject } from 'rxjs';
import { Service } from '@feathersjs/feathers';

export abstract class BackendBaseServiceInterface {
    protected connectionState: BackendConnectionState
    public connectionState$: BehaviorSubject<BackendConnectionState> // Service connection state observable

    constructor( @Inject( AppLoggerServiceToken ) protected loggerService, protected config: BackendConfig = null ) {
        // If no config is provided, sets a default one
        if ( config == null ) this.config = { apiEndPoint: 'http://localhost:3030' };
    }

    protected abstract updateConnectionState( newState: BackendConnectionState )
    /**
   * Get an instance to a service provided by the backend
   * @param name Service name
   */
    public abstract service( name: string ): Service<any>

    /**
     * Authenticate a user
     * @param credentials Credentials required by implemented backend
     */
    public abstract authenticate( credentials?: any ): Promise<any>

    /**
     * Logout a user
     */
    public abstract logout(): Promise<any>

    /**
     * Check if a user is actually authenticated
     */
    public abstract isAuth(): Promise<boolean>

}