import { BaseSandboxService } from "src/app/shared/sandboxes/base-sandbox.service";
import { Observable, BehaviorSubject } from "rxjs";
import { UserModel } from "src/app/shared/models/user.model";
import { Store } from "@ngxs/store";
import { AppLoggerServiceInterface } from "src/app/shared/services/logger/app-logger/service/app-logger.service";
import { FeathersjsBackendService } from "src/app/shared/services/backend_API_Endpoints/socketio/backend-feathers.service";
import { AppLoggerServiceToken } from "src/app/shared/services/logger/app-logger/app-logger-token";
import { Router } from "@angular/router";
import { Inject } from "@angular/core";
import { BackendConnectionState } from "src/app/shared/models/backend.connection.state.model";


export abstract class LayoutContainerSandboxInterface extends BaseSandboxService {
    protected _ApiServiceConnectionState$: BehaviorSubject<BackendConnectionState>

    constructor(
        protected feathers: FeathersjsBackendService,
        @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerServiceInterface,
        store: Store,
        protected router: Router ) {
        super( store, loggerService )
        this._ApiServiceConnectionState$ = this.feathers.connectionState$
    }


    public get ApiServiceConnectionState$(): BehaviorSubject<BackendConnectionState> {
        return this._ApiServiceConnectionState$
    }

    public abstract navigateLogin(): void
    public abstract navigateLogout(): void
}