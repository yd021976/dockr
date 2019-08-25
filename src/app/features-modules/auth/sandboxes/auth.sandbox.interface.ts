import { BaseSandboxService } from '../../../shared/sandboxes/base-sandbox.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { AppLoggerServiceInterface } from '../../../shared/services/logger/app-logger/service/app-logger.service';
import { Store } from '@ngxs/store';
import { AppLoggerServiceToken } from '../../../shared/services/logger/app-logger/app-logger-token';
import { loginCredentials } from '../../../shared/models/user.model';
import { Inject } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class AuthSandboxInterface extends BaseSandboxService {
    public authError$: Observable<string>
    
    constructor(
        protected store: Store,
        @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerServiceInterface,
        protected authService: AuthService
    ) {
        super( store, loggerService )
    }

    public abstract Login( credentials?: loginCredentials ): Promise<boolean>
    public abstract logout(): Promise<void>
}