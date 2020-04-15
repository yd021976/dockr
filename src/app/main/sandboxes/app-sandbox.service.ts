import { Injectable } from '@angular/core';
import { AuthService, AuthenticateEvent, AuthenticateEventTypes } from '../../shared/services/auth/auth.service';
import { BaseSandboxService } from '../../shared/sandboxes/base-sandbox.service';
import { User_Action_Login_Success, User_Action_Logout_Success, User_Action_Login } from '../../shared/store/actions/user.actions';
import { Observable } from 'rxjs';
import { skip } from 'rxjs/operators'
import { Select, Store } from '@ngxs/store';
import { AppNotificationsState } from '../../shared/store/states/application.notifications.state';
import { ApplicationNotification, ApplicationNotificationType } from '../../shared/models/application.notifications.model';
import { PermissionsService } from '../../shared/services/acl/permissions/permissions.service';
import { ApplicationNotifications_Append_Message } from '../../shared/store/actions/application-notifications.actions';
import { RolesService } from '../../shared/services/acl/roles/roles.service';
import { AclRoleModel } from '../../shared/models/acl.role.model';
import { UserModel } from '../../shared/models/user.model';
import { Ability } from '@casl/ability';
import { StateResetAll, StateClear, StateReset } from 'ngxs-reset-plugin';
import { UserState } from 'src/app/shared/store/states/user.state';
import { AclEntitiesState } from 'src/app/shared/store/states/acl/entities.state/acl2.entities.state';
import { ApplicationLocksState } from 'src/app/shared/store/states/locks/application.locks.state';
import { SiteZonesState } from 'src/app/shared/store/states/site.zones/entities/site.zones.state';

@Injectable()
export class AppSandboxService extends BaseSandboxService {
    private static loginCount: number = 0
    protected readonly logger_name: string = "AppSandboxService";
    @Select(AppNotificationsState.notifications$) public notifications: Observable<ApplicationNotification[]>

    constructor(
        protected authservice: AuthService,
        protected permissionsService: PermissionsService,
        protected roleService: RolesService
    ) {
        super()
    }

    /**
     * fake resolver
     */
    public resolve(route, state) {
        return true
    }

    /**
     * State selectors
     */
    public getNotifications$() {
        return this.notifications
    }
    private login(user: UserModel): Promise<boolean> {
        // Reset permissions and load permissions for new logged in user
        this.permissionsService.resetAbility()
        return this.loadPermissions(user)
    }
    private logout(): Promise<Ability> {
        // Reset permissions
        return Promise.resolve(this.permissionsService.resetAbility())
    }

    /**
     * Handle user login state
     */
    private authSubscribe() {
        // Subscribe to user login/logout/session expired events
        this.authservice.user$.pipe(skip(1)).subscribe((event: AuthenticateEvent) => {
            // IMPORTANT: because LOGIN & LOGOUT are UI actions, assume the "user" store has been updated by the module/component that have done login/logout action
            // ONLY "session expired" is not a UI action and comes from the server when token is expired => We MUST update store state HERE
            switch (event.event) {
                case AuthenticateEventTypes.LOGIN:
                    this.permissionsService.resetAbility()
                    this.loadPermissions(event.user)
                    break
                case AuthenticateEventTypes.LOGOUT:
                    this.permissionsService.resetAbility()
                    break
                case AuthenticateEventTypes.EXPIRED:
                    this.permissionsService.resetAbility()
                    this.store.dispatch(new ApplicationNotifications_Append_Message(new ApplicationNotification('Session expired', 'not authenticated', ApplicationNotificationType.WARNING)))

                    // Ensure store is up to date with logout user
                    this.store.dispatch(new User_Action_Logout_Success())
                    break
                default:
                    break
            }
        })
    }
    /**
     * Login user at app startup
     * 
     * IMPORTANT: should be called only once at application startup
     */
    public startUpLogin(): Promise<any> {
        // Ensure login is called only once
        AppSandboxService.loginCount = AppSandboxService.loginCount + 1
        if (AppSandboxService.loginCount > 1) return

        this.store.dispatch(new User_Action_Login())
        return this.authservice.reAuthenticate()
            .then((user) => {
                this.store.dispatch(new User_Action_Login_Success(user))
                return this.login(user)
            })
            .catch((err) => {
                this.store.dispatch(new User_Action_Login_Success(null))
                return this.logout()
            })
            .finally(() => {
                return this.authSubscribe()
            })
    }

    private loadPermissions(user: UserModel): Promise<boolean> {
        return this.roleService.find({ query: { '_id': { '$in': user.roles } } })
            .then((roles: AclRoleModel[]) => {
                this.permissionsService.setAbility(roles)
                return true
            })
            .catch(err => {
                this.store.dispatch(new ApplicationNotifications_Append_Message(new ApplicationNotification(err.message, 'authService-load.roles', ApplicationNotificationType.WARNING)))
                return false
            })
    }

    /** login/Logout events notification */
    protected on_login() { }
    protected on_logout() {
        this.store.dispatch(new StateResetAll(SiteZonesState))
    }

}