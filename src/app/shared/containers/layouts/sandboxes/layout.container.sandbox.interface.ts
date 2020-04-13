import { BaseSandboxService } from "src/app/shared/sandboxes/base-sandbox.service";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import { BackendConnectionState } from "src/app/shared/models/backend.connection.state.model";
import { ApplicationInjector } from "src/app/shared/application.injector.class";
import { BackendBaseServiceInterface } from "src/app/shared/services/backend.api.endpoint/interfaces/backend.base.service";
import { BackendServiceToken } from "src/app/shared/services/backend.api.endpoint/backend.service.token";
import { Select } from "@ngxs/store";
import { ApplicationState } from "src/app/shared/store/states/application.state";


export abstract class LayoutContainerSandboxInterface extends BaseSandboxService {
    protected _ApiServiceConnectionState$: BehaviorSubject<BackendConnectionState>
    protected backend_service: BackendBaseServiceInterface
    protected router: Router

    constructor(
    ) {
        super()
        this.backend_service = ApplicationInjector.injector.get( BackendServiceToken )
        this.router = ApplicationInjector.injector.get( Router )
        this._ApiServiceConnectionState$ = this.backend_service.connectionState$
    }

    /**
     * Fake resolver
     */
    public resolve( route, state ) {
        return true
    }


    public get ApiServiceConnectionState$(): BehaviorSubject<BackendConnectionState> {
        return this._ApiServiceConnectionState$
    }

    public abstract navigateLogin(): void
    public abstract navigateLogout(): void
}