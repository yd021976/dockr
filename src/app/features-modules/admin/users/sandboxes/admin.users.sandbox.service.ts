import { Injectable } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { UserModel, UserModelBase } from "../../../../shared/models/user.model";
import { Users_Load_All, Users_Load_All_Success, Users_Load_All_Error, Users_Select_User, Users_Update_User, Users_Update_User_Success, Users_Update_User_Error, Users_Add, Users_Add_Success, Users_Add_Error, Users_Remove, Users_Remove_Error, Users_Remove_Success } from "../../../../shared/store/actions/users.action";
import { ApplicationNotification, ApplicationNotificationType } from "../../../../shared/models/application.notifications.model";
import { ApplicationNotifications_Append_Message } from "../../../../shared/store/actions/application-notifications.actions";
import { UsersState } from "../../../../shared/store/states/users.state";
import { AclRoleModel } from "../../../../shared/models/acl.role.model";
import { RolesStateActions } from "../../../../shared/store/actions/acl2/acl2.role.entity.actions";
import { RolesSelectors } from "../../../../shared/store/states/acl/selectors/roles.selectors";
import { AdminUsersSandboxInterface } from "./admin.users.sandbox.interface";

@Injectable()
export class AdminUsersSandboxService extends AdminUsersSandboxInterface {
    @Select( UsersState.users_list ) public users$: Observable<UserModelBase[]>
    @Select( UsersState.selected_user ) public selected_user$: Observable<UserModelBase>
    @Select( RolesSelectors.roles_get_list ) public available_roles$: Observable<AclRoleModel[]>

    /**
     * 
     * @param store 
     * @param logger 
     * @param users_service 
     * @param roles_service 
     */
    constructor() {
        super()
    }

    /**
     * 
     * @param route 
     * @param state 
     */
    resolve( route, state ) {
        let promises: Promise<any>[] = []
        promises.push( this.loadAllUsers() )
        promises.push( this.loadAllRoles() )
        return Promise.all( promises )
    }

    /**
     * 
     */
    private loadAllUsers(): Promise<void> {
        this.store.dispatch( new Users_Load_All() )
        return this.users_service.find()
            .then( results => {
                this.store.dispatch( new Users_Load_All_Success( results ) )
            } )
            .catch( err => {
                this.store.dispatch( new Users_Load_All_Error( err.message ) )
                this.store.dispatch( new ApplicationNotifications_Append_Message( new ApplicationNotification( err.message, 'LoadAllUsers', ApplicationNotificationType.ERROR ) ) )
            } )
    }

    /**
     * 
     */
    private loadAllRoles(): Promise<void> {
        this.store.dispatch( new RolesStateActions.Load_All() )
        return this.roles_service.find()
            .then( ( roles: AclRoleModel[] ) => {
                this.store.dispatch( new RolesStateActions.Load_All_Success( roles ) )
            } )
            .catch( err => {
                this.store.dispatch( new RolesStateActions.Load_All_Error( err.message ) )
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