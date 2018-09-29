import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { Store, Select } from "@ngxs/store";

import { ApplicationState } from "../../../shared/store/states/application.state";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { loginCredentials } from "../../../shared/models/user.model";
import { NotificationBaseService } from "../../../shared/services/notifications/notifications-base.service";
import { BaseSandboxService } from "../../../shared/sandboxes/base-sandbox.service";
import { UserBackendApiModel } from "../../../shared/models/user.model";
import { UserLoginAction, UserLoginErrorAction, UserLoginSuccessAction, UserLogoutSuccessAction, UserLogoutErrorAction } from "../../../shared/store/actions/user.actions";


@Injectable()
export class AuthSandbox extends BaseSandboxService {
    // Keep track of previous server connection state
    private currentIsConnected: boolean = false;

    @Select(ApplicationState.authError) public authError$: Observable<string>;

    constructor(
        protected authService: AuthService,
        notificationService: NotificationBaseService,
        logger: NGXLogger,
        store: Store,
        protected router: Router
    ) {
        super(notificationService, store, logger);
    }

    public Login(credentials: loginCredentials): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.doLogin(credentials).then(() => resolve(true)).catch(() => resolve(false));
        });
    }
    private doLogin(credentials: loginCredentials) {
        this.logger.debug('[LoginSandbox] Login user START', credentials);
        this.store.dispatch(new UserLoginAction());
        return this.authService.authenticate(credentials)
            .then((user) => {
                this.store.dispatch(new UserLoginSuccessAction(user))
                this.logger.debug('[LoginSandbox] Login user END', 'OK', user);
            })
            .catch((error) => {
                this.store.dispatch(new UserLoginErrorAction(error.message));
                this.logger.debug('[LoginSandbox] Login user END', "ERROR", error);
            })
    }
    public logout(): Promise<void> {
        this.logger.debug('[LoginSandbox] Logout START');
        return this.authService.logout()
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
