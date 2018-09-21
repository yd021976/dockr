import { Injectable } from "@angular/core";
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
export class LoginSandbox extends SandboxBaseService {
    @Select(ApplicationState.authError) public authError$:Observable<string>;

    constructor(
        protected feathersBackend: FeathersjsBackendService,
        notificationService: NotificationBaseService,
        store: Store,
        protected router: Router
    ) {
        super(notificationService, store);
    }

    public Login(credentials: loginCredentials) {
        this.store.dispatch(new UserLoginAction());
        this.feathersBackend.authenticate(credentials)
            .then(user => this.store.dispatch(new UserLoginSuccessAction(user)))
            .catch((error) => {
                this.store.dispatch(new UserLoginErrorAction(error.message));
            })
    }
    public logout() {
        this.feathersBackend.logout()
            .then(() => this.store.dispatch(new UserLogoutSuccessAction()))
            .catch(error => this.store.dispatch(new UserLogoutErrorAction(error.message)))
    }
}
