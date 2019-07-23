import { Injectable, Inject } from "@angular/core";
import { BaseSandboxService } from "../base-sandbox.service";
import { AppLoggerServiceToken } from "../../services/logger/app-logger/app-logger-token";
import { AppLoggerService } from "../../services/logger/app-logger/service/app-logger.service";
import { Store, Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { UserModel, UserModelBase } from "../../models/user.model";
import { UsersService } from "../../services/users.service";
import { Users_Load_All, Users_Load_All_Success, Users_Load_All_Error, Users_Select_User, Users_Update_User, Users_Update_User_Success, Users_Update_User_Error, Users_Add, Users_Add_Success, Users_Add_Error, Users_Remove, Users_Remove_Error, Users_Remove_Success } from "../../store/actions/users.action";
import { ApplicationNotification, ApplicationNotificationType } from "../../models/acl2/application.notifications.model";
import { ApplicationNotifications_Append_Message } from "../../store/actions/application-notifications.actions";
import { UsersState } from "../../store/states/users.state";
import { Acl2State } from "../../store/states/acl2/acl2.state";
import { RoleModel } from "../../models/acl/roles.model";
import { RolesService } from "../../services/acl/roles/roles.service";
import { Acl_Load_All, Acl_Load_All_Error, Acl_Load_All_Success } from "../../store/actions/acl2/acl2.state.actions";

@Injectable()
export class AdminUsersSandboxService extends BaseSandboxService {
    @Select( UsersState.users_list ) public users$: Observable<UserModelBase[]>
    @Select( UsersState.selected_user ) public selected_user$: Observable<UserModelBase>
    @Select( Acl2State.roles_get_list ) public available_roles$: Observable<RoleModel[]>


    constructor( store: Store, @Inject( AppLoggerServiceToken ) public logger: AppLoggerService, public users_service: UsersService, private roles_service: RolesService ) {
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
                this.store.dispatch( new ApplicationNotifications_Append_Message( new ApplicationNotification( err.message, 'LoadAllUsers', ApplicationNotificationType.ERROR ) ) )
            } )

        this.store.dispatch( new Acl_Load_All() )
        this.roles_service.find()
            .then( ( roles: RoleModel[] ) => {
                this.store.dispatch( new Acl_Load_All_Success( roles ) )
            } )
            .catch( err => {
                this.store.dispatch( new Acl_Load_All_Error( err.message ) )
            } )
    }

    /**
     * Set a user as selection
     * @param user 
     */
    public select_user( user: UserModelBase ) {
        this.store.dispatch( new Users_Select_User( user ) )
    }

    /**
     * 
     * @param user 
     */
    public users_add_user( user: UserModelBase ) {
        this.store.dispatch( new Users_Add( user ) )
        // Update backend users & update application state
        this.users_service.create( user )
            .then( ( created_user: UserModel ) => {
                this.store.dispatch( new Users_Add_Success( created_user ) )
            } )
            .catch( error => {
                this.store.dispatch( new Users_Add_Error( error.message ) )
                this.store.dispatch( new ApplicationNotifications_Append_Message( new ApplicationNotification( error.message, 'CreateUser', ApplicationNotificationType.ERROR ) ) )
            } )
    }

    /**
     * 
     */
    public users_remove_user( user: UserModelBase ) {
        this.store.dispatch( new Users_Remove( user ) )
        this.users_service.remove( user )
            .then( ( removed_user ) => {
                this.store.dispatch( new Users_Remove_Success( removed_user ) )
            } )
            .catch( ( err ) => {
                this.store.dispatch( new Users_Remove_Error( err.message ) )
                this.store.dispatch( new ApplicationNotifications_Append_Message( new ApplicationNotification( err.message, 'RemoveUser', ApplicationNotificationType.ERROR ) ) )
            } )
    }

    /**
     * 
     * @param user 
     */
    public users_update_user( user: UserModelBase ) {
        this.store.dispatch( new Users_Update_User() )
        this.users_service.update( user )
            .then( updatedUser => {
                this.store.dispatch( new Users_Update_User_Success( updatedUser ) )
            } )
            .catch( err => {
                this.store.dispatch( new Users_Update_User_Error( err.message ) )
                this.store.dispatch( new ApplicationNotifications_Append_Message( new ApplicationNotification( err.message, 'UpdateUser', ApplicationNotificationType.ERROR ) ) )
            } )
    }
}