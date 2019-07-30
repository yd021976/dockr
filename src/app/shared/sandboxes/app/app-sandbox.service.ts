import { Injectable, Inject } from '@angular/core';
import { AuthService, AuthenticateEvent, AuthenticateEventTypes } from '../../services/auth/auth.service';
import { BaseSandboxService } from '../base-sandbox.service';
import { User_Action_Login_Success, User_Action_Logout_Success, User_Action_Login } from '../../store/actions/user.actions';
import { Observable } from 'rxjs';
import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token';
import { AppLoggerService } from '../../services/logger/app-logger/service/app-logger.service';
import { Store, Select } from '@ngxs/store';
import { AppNotificationsState } from '../../store/states/application.notifications.state';
import { ApplicationNotification, ApplicationNotificationType } from '../../models/acl2/application.notifications.model';
import { PermissionsService } from '../../services/acl/permissions/permissions.service';
import { ApplicationNotifications_Append_Message } from '../../store/actions/application-notifications.actions';
import { RolesService } from '../../services/acl/roles/roles.service';
import { RoleModel } from '../../models/acl/roles.model';
import { UserModelBase } from '../../models/user.model';

@Injectable()
export class AppSandboxService extends BaseSandboxService {
    private static loginCount: number = 0
    private readonly loggerName: string = "AppSandboxService";
    @Select( AppNotificationsState.notifications$ ) private notifications: Observable<ApplicationNotification[]>

    constructor(
        @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerService,
        protected authservice: AuthService,
        protected permissionsService: PermissionsService,
        protected roleService: RolesService,
        protected store: Store
    ) {
        super( store, loggerService )

        // Subscribe to user login/logout/session expired events
        this.authservice.user$.subscribe( ( event: AuthenticateEvent ) => {

            // IMPORTANT: because LOGIN & LOGOUT are UI actions, assume the "user" store has been updated by the module/component that have done login/logout action
            // ONLY "session expired" is not a UI action and comes from the server when token is expired => We MUST update store state HERE
            switch ( event.event ) {
                case AuthenticateEventTypes.LOGIN:
                    this.permissionsService.resetAbility()
                    this.loadPermissions( event.user )
                    break
                case AuthenticateEventTypes.LOGOUT:
                    this.permissionsService.resetAbility()
                    break
                case AuthenticateEventTypes.EXPIRED:
                    this.permissionsService.resetAbility()
                    this.store.dispatch( new ApplicationNotifications_Append_Message( new ApplicationNotification( 'Session expired', 'not authenticated', ApplicationNotificationType.WARNING ) ) )

                    // Ensure store is up to date with logout user
                    this.store.dispatch( new User_Action_Logout_Success() )
                    break
                default:
                    break
            }
        } )
    }
    /**
     * State selectors
     */
    public getNotifications$() {
        return this.notifications
    }
    private login( user: UserModelBase ) {
        // Reset permissions and load permissions for new logged in user
        this.permissionsService.resetAbility()
        this.loadPermissions( user )
    }
    private logout() {
        // Reset permissions
        this.permissionsService.resetAbility()
    }
    /**
     * Login user at app startup
     * 
     * IMPORTANT: should be called only once at application startup
     */
    public startUpLogin(): Promise<any> {
        // Ensure login is called only once
        AppSandboxService.loginCount = AppSandboxService.loginCount + 1
        if ( AppSandboxService.loginCount > 1 ) return

        this.store.dispatch( new User_Action_Login() )
        return this.authservice.authenticate()
            .then( ( user ) => {
                this.store.dispatch( new User_Action_Login_Success( user ) )
            } )
            .catch( ( error ) => {
                this.store.dispatch( new User_Action_Login_Success( null ) )
            } )
    }

    private loadPermissions( user: UserModelBase ) {
        this.roleService.find( { query: { '_id': { '$in': user.roles } } } )
            .then( ( roles: RoleModel[] ) => {
                this.permissionsService.setAbility( roles )
            } )
            .catch( err => {
                this.store.dispatch( new ApplicationNotifications_Append_Message( new ApplicationNotification( err.message, 'authService-load.roles', ApplicationNotificationType.WARNING ) ) )
            } )
    }
}