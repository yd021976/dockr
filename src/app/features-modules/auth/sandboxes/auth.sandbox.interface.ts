import { BaseSandboxService } from '../../../shared/sandboxes/base-sandbox.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { AppLoggerServiceInterface } from '../../../shared/services/logger/app-logger/service/app-logger.service';
import { Store } from '@ngxs/store';
import { AppLoggerServiceToken } from '../../../shared/services/logger/app-logger/app-logger-token';
import { loginCredentials } from '../../../shared/models/user.model';
import { Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationInjector } from 'src/app/shared/application.injector.class';

export abstract class AuthSandboxInterface extends BaseSandboxService {
    protected authService: AuthService
    public authError$: Observable<string>

    constructor() {
        super()
        this.authService = ApplicationInjector.injector.get(AuthService)
    }

    /**
     * Fake resolver
     */
    public resolve( route, state ) {
        return true
    }

    /**
     * 
     */
    public abstract Login( credentials?: loginCredentials ): Promise<boolean>
    public abstract logout(): Promise<void>
}