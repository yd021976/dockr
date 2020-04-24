import { Injectable } from "@angular/core";
import { AdminPermissionsSandboxInterface } from "./admin.permissions.sandbox.interface";
import { AdminPermissionsRolesStateActions } from "../store/actions/admin.permissions.role.entity.actions";
import { ApplicationActions } from "src/app/shared/store/actions/application.actions";
import { ApplicationNotification, ApplicationNotificationType } from "src/app/shared/models/application.notifications.model";
import { Observable, of } from "rxjs";
import { AdminPermissionsBaseModel,AdminPermissionsEntityTypes } from "../store/models/admin.permissions.model";
import { AdminPermissionsStateSelectors } from '../store/selectors/admin.permissions.selectors';
import { AdminPermissionsTreedataService } from "../services/admin.permissions.treedata.service";

@Injectable({ providedIn: 'root' })
export class AdminPermissionsSandboxService extends AdminPermissionsSandboxInterface {
    public isAclLocked$: Observable<boolean> = of(false)

    public get datasource() {return this.treedatasource.treedatasource}
    public get treecontrol() { return this.treedatasource.treecontrol }
    public get hasChild() { return this.treedatasource.hasChild }
    
    constructor(private treedatasource: AdminPermissionsTreedataService) {
        super()
        this.treenodes$ = this.nodeGetChildren()
        this.treedatasource.data$ = this.treenodes$
        this.treedatasource.getNodeChildren = this.nodeGetChildren
    }

    /**
     * Route Resolver : Load backend data
     * 
     * @param route 
     * @param state 
     */
    resolve(route, state): Promise<any> {
        return this._loadRoles()
    }

    private _loadRoles(): Promise<any> {
        this.store.dispatch(new AdminPermissionsRolesStateActions.Load_All())
        return this.rolesService.find()
            .then((results) => {
                this.store.dispatch(new AdminPermissionsRolesStateActions.Load_All_Success(results))
            })
            .catch((err) => {
                this.store.dispatch(new ApplicationActions.Application_Event_Notification(new ApplicationNotification(err.message, err['name'], ApplicationNotificationType.ERROR)))
                this.store.dispatch(new AdminPermissionsRolesStateActions.Load_All_Error(err))
            })
    }

    /**
     * Get a node children entities array
     */
    public nodeGetChildren = (node: AdminPermissionsEntityTypes = null): Observable<AdminPermissionsEntityTypes[]> => {
        return this.store.select(AdminPermissionsStateSelectors.getChildren(node))
    }
    /** unused but must be implemented */
    protected on_login() { }
    protected on_logout() { }

}