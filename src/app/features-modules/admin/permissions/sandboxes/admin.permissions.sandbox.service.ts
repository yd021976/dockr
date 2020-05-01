import { Injectable } from "@angular/core";
import { AdminPermissionsSandboxInterface } from "./admin.permissions.sandbox.interface";
import { AdminPermissionsRolesStateActions } from "../store/actions/admin.permissions.role.entity.actions";
import { ApplicationActions } from "src/app/shared/store/actions/application.actions";
import { ApplicationNotification, ApplicationNotificationType } from "src/app/shared/models/application.notifications.model";
import { Observable, of } from "rxjs";
import { AdminPermissionsEntityTypes, AdminPermissionsFlatNode, ALLOWED_STATES, AdminPermissionsServiceEntity, AdminPermissionsRoleEntity, AdminPermissionsStateModel, AdminPermissionsEntitiesTypes, ENTITY_TYPES, AdminPermissionsStateEntities } from "../store/models/admin.permissions.model";
import { AdminPermissionsStateSelectors } from '../store/selectors/admin.permissions.selectors';
import { AdminPermissionsTreedataService } from "../services/admin.permissions.treedata.service";
import { AdminPermissionsStateActions } from "../store/actions/admin.permissions.state.actions";
import { ApplicationLocksActions } from "src/app/shared/store/actions/application.locks.actions";
import { ApplicationNotifications_Append_Message } from "src/app/shared/store/actions/application-notifications.actions";
import { Select } from "@ngxs/store";
import { ApplicationLocksSelectors } from "src/app/shared/store/states/locks/application.locks.selectors";
import { AdminPermissionsUIActions } from "../store/actions/admin.permissions.ui.actions";
import { AdminPermissionsUIState } from '../store/state/ui/admin.permissions.ui.state';
import { Role } from "../store/entity.management/entity.utilities/internals/admin.permissions.entity.utilities.role";
import { AdminPermissionsNormalizrSchemas } from "../store/entity.management/normalizer";
import { v4 as uuid } from 'uuid';

@Injectable({ providedIn: 'root' })
export class AdminPermissionsSandboxService extends AdminPermissionsSandboxInterface {
    static readonly lock_ressouce_name: string = "admin.permissions"

    @Select(ApplicationLocksSelectors.isLocked(AdminPermissionsSandboxService.lock_ressouce_name)) public isAclLocked$: Observable<boolean>
    @Select(AdminPermissionsUIState.selected) public selectedNode$: Observable<AdminPermissionsFlatNode>

    public get datasource() { return this.treedatasource.treedatasource }
    public get treecontrol() { return this.treedatasource.treecontrol }
    public get hasChild() { return this.treedatasource.hasChild }

    private readonly normalizer: AdminPermissionsNormalizrSchemas
    private readonly role_entity_utilities: Role


    /**
     * Constructor
     */
    constructor(private treedatasource: AdminPermissionsTreedataService) {
        super()
        this.treenodes$ = this.nodeGetChildren()
        this.treedatasource.data$ = this.treenodes$
        this.treedatasource.getNodeChildren = this.nodeGetChildren

        this.normalizer = new AdminPermissionsNormalizrSchemas()
        this.role_entity_utilities = new Role()

        /** observable for dirty entities to save */
        this.store.select(AdminPermissionsStateSelectors.dirtyRoles).subscribe((entities) => {
            /**TODO: update backend database */
        })
    }

    /**
     * Route Resolver : Load backend data
     * 
     * @param route 
     * @param state 
     */
    resolve(route, state): Promise<any> {
        let promises: Promise<any>[] = []
        promises.push(this._loadRoles(), this.init_lock_status())
        return Promise.all(promises)
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

    /**
     * 
     */
    public node_update_allowed(node: AdminPermissionsFlatNode, allowed_status: ALLOWED_STATES) {
        this.store.dispatch(new AdminPermissionsStateActions.NodeUpdateAllowedStatus(node, allowed_status)).toPromise().then((result) => {

        })
    }

    private init_lock_status(): Promise<any> {
        this.store.dispatch([new ApplicationLocksActions.remove({ name: AdminPermissionsSandboxService.lock_ressouce_name })])
        return this.resourcesLocksService.list(false)
            .then(locked_resources => {
                // Search for existing "acl" lock
                Object.keys(locked_resources).forEach((resource_id) => {
                    if (resource_id == AdminPermissionsSandboxService.lock_ressouce_name) {
                        // check resource is locked
                        if (locked_resources[resource_id].lockInfos.state == 'locked')
                            // The resource "admin permissions" is already lock, update state
                            this.store.dispatch(new ApplicationLocksActions.add({ name: AdminPermissionsSandboxService.lock_ressouce_name, isLocked: true }))
                    }
                })
                return // progress to next "then" step
            })
            .then(() => { })
            .catch(err => { })
    }
    public unlock_ressource(): Promise<any> {
        return this.resourcesLocksService.release(AdminPermissionsSandboxService.lock_ressouce_name)
            .then(released => {
                this.store.dispatch([
                    new ApplicationNotifications_Append_Message(new ApplicationNotification('Data are unlocked. You can\'t modify them.', 'AclRelease', ApplicationNotificationType.INFO)),
                    new ApplicationLocksActions.update(AdminPermissionsSandboxService.lock_ressouce_name, { name: AdminPermissionsSandboxService.lock_ressouce_name, isLocked: false })
                ])
                return released
            })
            .catch((err) => {
                this.store.dispatch([
                    new ApplicationLocksActions.update(AdminPermissionsSandboxService.lock_ressouce_name, { name: AdminPermissionsSandboxService.lock_ressouce_name, isLocked: false }),
                    new ApplicationActions.Application_Event_Notification(new ApplicationNotification(err.message, 'AclReleaseError', ApplicationNotificationType.ERROR))
                ])
            })

    }
    public lock_ressource(): Promise<any> {
        return this.resourcesLocksService.lock(AdminPermissionsSandboxService.lock_ressouce_name)
            .then(locked => {
                this.store.dispatch([
                    new ApplicationLocksActions.update(AdminPermissionsSandboxService.lock_ressouce_name, { name: AdminPermissionsSandboxService.lock_ressouce_name, isLocked: true }),
                    new ApplicationNotifications_Append_Message(new ApplicationNotification('Data are locked. You can modify them.', 'AclLocked', ApplicationNotificationType.INFO))
                ])
                return locked
            })
            .catch(err => {
                if (err.name != 'lockAlreadyAcquired') {
                    this.store.dispatch(new ApplicationActions.Application_Event_Notification(new ApplicationNotification(err.message, 'AclLockError', ApplicationNotificationType.ERROR)))
                }
                else {
                    this.store.dispatch([new ApplicationLocksActions.update(AdminPermissionsSandboxService.lock_ressouce_name, { name: AdminPermissionsSandboxService.lock_ressouce_name, isLocked: false })])
                    return err.data['lockInfos'] || null
                }
            })
    }

    /**
     * 
     */
    public selectNode(node: AdminPermissionsFlatNode) {
        this.store.dispatch(new AdminPermissionsUIActions.SelectTreeviewNode(node))
    }
    /**
     * Add role entity
     */
    add_role_entity(name: string) {
        this.store.dispatch(new AdminPermissionsRolesStateActions.Add_Entity(name))

        // const role_object = this.normalizer.denormalize([new_entity], this.normalizer.mainSchema, entities)

        // this.rolesService.update(role_object, true)
        //     .then((result) => {
        //         this.store.dispatch(new AdminPermissionsRolesStateActions.Add_Entity_Success(name))
        //     }).catch(error => {
        //         this.store.dispatch([
        //             new AdminPermissionsRolesStateActions.Add_Entity_Error(error),
        //             new ApplicationActions.Application_Event_Notification(new ApplicationNotification(error, 'AddRoleError', ApplicationNotificationType.ERROR))
        //         ])
        //     })
    }
    /**
     * remove role entity
     */
    remove_role_entity(node: AdminPermissionsFlatNode) { }
    /**
     * Add service entity
     */
    add_service_entity(entity: AdminPermissionsServiceEntity) { }
    /**
     * remove service entity
     */
    remove_service_entity(node: AdminPermissionsFlatNode) { }

    /** unused but must be implemented */
    protected on_login() { }
    protected on_logout() { }

}