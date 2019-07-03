import { Injectable, Inject } from "@angular/core";
import { BaseSandboxService } from "../base-sandbox.service";
import { AppLoggerServiceToken } from "../../services/logger/app-logger/app-logger-token";
import { AppLoggerService } from "../../services/logger/app-logger/service/app-logger.service";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { UserModel, UserModelBase } from "../../models/user.model";
import { UsersService } from "../../services/users.service";
import { Users_Load_All, Users_Load_All_Success, Users_Load_All_Error } from "../../store/actions/users.action";

@Injectable()
export class AdminUsersSandboxService extends BaseSandboxService {
    private users$: Observable<UserModelBase[]>

    constructor( store: Store, @Inject( AppLoggerServiceToken ) public logger: AppLoggerService, public users_service: UsersService ) {
        super( store, logger )
    }

    public init() {
        this.store.dispatch( new Users_Load_All() )
        this.users_service.find()
            .then( results => {
                this.store.dispatch( new Users_Load_All_Success( results ) )
            } )
            .catch( err => {
                this.store.dispatch( new Users_Load_All_Error( err.message ) )
            } )
    }
    public getUsers$() {
        return this.users$
    }

    public users_add_user( user: UserModelBase ) { }
    public users_remove_user( user: UserModelBase ) { }
    public users_update_user( user: UserModelBase ) { }
    public user_add_role( user: UserModelBase, role: string ) { }
    public user_remove_role( user: UserModelBase, role: string ) { }
}