import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { Store, Select } from "@ngxs/store";

import { ApplicationState } from "../../../shared/store/states/application.state";
import { FeathersjsBackendService } from "../../../shared/services/backend/socketio/backend-feathers.service";
import { loginCredentials } from "../../../shared/models/user.model";
import { NotificationBaseService } from "../../../shared/services/notifications/notifications-base.service";
import { SandboxBaseService } from "../../../shared/sandboxes/sandbox-base.service";
import { UserLoginAction, UserLoginErrorAction, UserLoginSuccessAction, UserLogoutSuccessAction, UserLogoutErrorAction } from "../../../shared/store/actions/user.actions";

@Injectable()
export class AuthSandbox extends SandboxBaseService {
    @Select(ApplicationState.authError) public authError$: Observable<string>;

    constructor(
        protected feathersBackend: FeathersjsBackendService,
        notificationService: NotificationBaseService,
        logger: NGXLogger,
        store: Store,
        protected router: Router
    ) {
        super(notificationService, store, logger);
    }

    public Login(credentials: loginCredentials):Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.doLogin(credentials).then(() => resolve(true)).catch(() => resolve(false));
        });
    }
    private doLogin(credentials: loginCredentials) {
        this.logger.debug('[LoginSandbox] Login user START', credentials);
        this.store.dispatch(new UserLoginAction());
        return this.feathersBackend.authenticate(credentials)
            .then((user) => {
                this.store.dispatch(new UserLoginSuccessAction(user))
                this.logger.debug('[LoginSandbox] Login user END', 'OK', user);
            })
            .catch((error) => {
                this.store.dispatch(new UserLoginErrorAction(error.message));
                this.logger.debug('[LoginSandbox] Login user END', "ERROR", error);
            })
    }
    public logout() {
        this.logger.debug('[LoginSandbox] Logout START');
        this.feathersBackend.logout()
            .then(() => {
                this.logger.debug('[LoginSandbox] Logout END', 'OK');
                this.store.dispatch(new UserLogoutSuccessAction())
            })
            .catch((error) => {
                this.logger.debug('[LoginSandbox] Logout END', 'ERROR', error);
                this.store.dispatch(new UserLogoutErrorAction(error.message))
            })
    }
}
