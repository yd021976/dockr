import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Select } from "@ngxs/store";
import { AuthSandboxInterface } from "./auth.sandbox.interface";
import { loginCredentials, UserModel } from "../../../shared/models/user.model";
import { User_Action_Login, User_Action_Login_Success, User_Action_Login_Error, User_Action_Logout_Success, User_Action_Logout_Error } from "../../../shared/store/actions/user.actions";
import { ApplicationState } from "../../../shared/store/states/application.state";

@Injectable({ providedIn: 'root' })
export class AuthSandbox extends AuthSandboxInterface {
    protected readonly logger_name: string = "AuthSandbox";

    @Select(ApplicationState.authError) public authError$: Observable<string>

    constructor() {
        super()
        this.loggerService.createLogger(this.logger_name)
    }


    public Login(credentials?: loginCredentials): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.doLogin(credentials).then(() => resolve(true)).catch(() => resolve(false));
        });
    }
    private doLogin(credentials: loginCredentials) {
        this.loggerService.debug(this.logger_name, { message: 'login()', otherParams: ['START', credentials] });
        this.store.dispatch(new User_Action_Login());

        // We must logout current user before authenticate again (FeathersJS can't authenticate another user if a JWT already exists)
        return this.logout()
            .then(() => {
                return this.authService.authenticate(credentials)
                    .then((user: UserModel) => {
                        this.store.dispatch(new User_Action_Login_Success(user))
                        this.loggerService.debug(this.logger_name, { message: 'doLogin()', otherParams: ['auth service login called', 'SUCCESS', user] });
                    })
                    .catch((error) => {
                        this.store.dispatch(new User_Action_Login_Error(error.message));
                        this.loggerService.debug(this.logger_name, { message: 'doLogin()', otherParams: ['auth service login called', 'ERROR', error] });
                        throw error;
                    })
            })
            .catch((err) => {
                this.loggerService.debug(this.logger_name, { message: 'doLogin()', otherParams: ['auth service logout called', 'ERROR'] });
                throw err
            })
    }
    public logout(): Promise<void> {
        this.loggerService.debug(this.logger_name, { message: 'logout()', otherParams: ['START'] });
        return this.authService.logout()
            .then(() => {
                this.loggerService.debug(this.logger_name, { message: 'logout()', otherParams: ['END', 'OK'] });
                this.store.dispatch(new User_Action_Logout_Success())
            })
            .catch((error) => {
                this.loggerService.debug(this.logger_name, { message: 'logout()', otherParams: ['END', 'ERROR', error] });
                this.store.dispatch(new User_Action_Logout_Error(error.message))
            })
    }

    /** unused but must be implemented */
    protected on_login() { }
    protected on_logout() { }


}
