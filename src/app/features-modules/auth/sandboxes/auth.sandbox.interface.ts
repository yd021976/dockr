import { BaseSandboxService } from '../../../shared/sandboxes/base-sandbox.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { loginCredentials } from '../../../shared/models/user.model';
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