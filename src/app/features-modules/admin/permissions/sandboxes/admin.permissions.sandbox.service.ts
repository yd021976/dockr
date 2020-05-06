import { Injectable } from "@angular/core";
import { AdminPermissionsSandboxInterface } from "./admin.permissions.sandbox.interface";
import { AdminPermissionsRolesStateActions } from "../store/actions/admin.permissions.role.entity.actions";
import { ApplicationActions } from "src/app/shared/store/actions/application.actions";
import { ApplicationNotification, ApplicationNotificationType } from "src/app/shared/models/application.notifications.model";
import { Observable } from "rxjs";
import {
    AdminPermissionsEntityTypes,
    AdminPermissionsFlatNode,
    ALLOWED_STATES,
    AdminPermissionsServiceEntity,
    AdminPermissionsRoleEntity,
    AdminPermissionsEntitiesTypes,
    AdminPermissionsStateModel,
    AdminPermissionsStateUIModel,
    ENTITY_TYPES
} from "../store/models/admin.permissions.model";
import { AdminPermissionsStateSelectors } from '../store/selectors/admin.permissions.selectors';
import { AdminPermissionsTreedataService } from "../services/admin.permissions.treedata.service";
import { AdminPermissionsStateActions } from "../store/actions/admin.permissions.state.actions";
import { ApplicationLocksActions } from "src/app/shared/store/actions/application.locks.actions";
import { ApplicationNotifications_Append_Message } from "src/app/shared/store/actions/application-notifications.actions";
import { Select, Selector } from "@ngxs/store";
import { ApplicationLocksSelectors } from "src/app/shared/store/states/locks/application.locks.selectors";
import { AdminPermissionsUIActions } from "../store/actions/admin.permissions.ui.actions";
import { AdminPermissionsUIState } from '../store/state/ui/admin.permissions.ui.state';
import { Services_Load_All, Services_Load_All_Success } from "src/app/shared/store/actions/services.actions";
import { ServicesState } from "src/app/shared/store/states/services.state";
import { BackendServiceModel } from "src/app/shared/models/acl.services.model";
import { AdminPermissionsEntitiesState } from "../store/state/entities/admin.permissions.entities.state";
import { ServicesModel } from "src/app/shared/models/services.model";

@Injectable({ providedIn: 'root' })
export class AdminPermissionsSandboxService extends AdminPermissionsSandboxInterface {
    static readonly lock_ressouce_name: string = "admin.permissions"

    @Select(ApplicationLocksSelectors.isLocked(AdminPermissionsSandboxService.lock_ressouce_name)) public isAclLocked$: Observable<boolean>
    @Select(AdminPermissionsUIState.selected) public selectedNode$: Observable<AdminPermissionsFlatNode>
    @Select(AdminPermissionsStateSelectors.isDirty) public isDirty$: Observable<boolean>

    public get datasource() { return this.treedatasource.treedatasource }
    public get treecontrol() { return this.treedatasource.treecontrol }
    public get hasChild() { return this.treedatasource.hasChild }

    @Selector([ServicesState, AdminPermissionsUIState, AdminPermissionsEntitiesState])
    public static role_available_services(available_services: ServicesModel, ui_state: AdminPermissionsStateUIModel, permissions_state: AdminPermissionsStateModel) {
        if (ui_state.selected === null || ui_state.selected === undefined) return []

        /** get current selected entity. If not a role entity return empty array*/
        const role_entity: AdminPermissionsRoleEntity = permissions_state.entities[ui_state.selected.item.storage_key][ui_state.selected.item.uid]
        if (role_entity.entity_type !== ENTITY_TYPES.ROLE) return []

        const role_current_services: AdminPermissionsServiceEntity[] = Object.values(role_entity.services)
            .map((service_uid) => {
                return permissions_state.entities[role_entity.children_entities_meta.storage_key][service_uid]
            })
        const role_available_services = Object.values(available_services.services).filter((available_service: BackendServiceModel) => {
            /** Check service id is not already associated to a role */
            if (!(role_current_services.find((service_entity) => { return available_service.id === service_entity.id }))) {
                /** add this available service */
                return available_service
            }
        })
        return role_available_services
    }
    /**
     * Constructor
     */
    constructor(private treedatasource: AdminPermissionsTreedataService) {
        super()
        this.treenodes$ = this.nodeGetChildren()
        this.treedatasource.data$ = this.treenodes$
        this.treedatasource.getNodeChildren = this.nodeGetChildren
        this.treedatasource.isEntityDirty = this.isEntityDirty

        /** selectors */
        this.available_services$ = this.store.select(AdminPermissionsSandboxService.role_available_services)
    }

    /**
     * Route Resolver : Load backend data
     * 
     * @param route 
     * @param state 
     */
    resolve(route, state): Promise<any> {
        let promises: Promise<any>[] = []
        promises.push(this._loadRoles(), this.init_lock_status(), this.initServices())
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
     * Load backend available services
     */
    private initServices(): Promise<any> {
        this.store.dispatch(new Services_Load_All())
        return this.backendServices.find()
            .then((results) => {
                this.store.dispatch(new Services_Load_All_Success(results))
            })
            .catch((err) => {
                this.store.dispatch(new ApplicationActions.Application_Event_Notification(new ApplicationNotification(err.message, 'LoadRolesError', ApplicationNotificationType.ERROR)))
            })
    }
    /**
     * Get a node children entities array
     */
    public nodeGetChildren = (entity: AdminPermissionsEntityTypes = null): Observable<AdminPermissionsEntityTypes[]> => {
        return this.store.select(AdminPermissionsStateSelectors.getChildren(entity))
    }

    /**
     * Is an entity is dirty
     */
    public isEntityDirty = (entity: AdminPermissionsEntityTypes = null): Observable<boolean> => {
        return this.store.select(AdminPermissionsStateSelectors.isEntityDirty(entity))
    }

    /**
     * Cancel state pending changes
     */
    public cancel_update(entity: AdminPermissionsEntityTypes = null) {
        this.store.dispatch(new AdminPermissionsStateActions.CancelChanges())
    }


    /**
     * Save all state pending changes
     */
    public save_changes() {
        /** get dirty roles to save */
        const roles_to_save: AdminPermissionsEntitiesTypes = this.store.selectSnapshot(AdminPermissionsStateSelectors.getDirtyRoles)

        /** Iterate on roles to save */
        Object.values(roles_to_save).forEach((role_entity: AdminPermissionsRoleEntity) => {

        })
    }

    /**
     * Update allowed status of an entity, its parents and children 
     */
    public node_update_allowed(node: AdminPermissionsFlatNode, allowed_status: ALLOWED_STATES) {
        this.store.dispatch(new AdminPermissionsStateActions.NodeUpdateAllowedStatus(node, allowed_status))
            .toPromise()
            .then(() => {
                /**DEBUG */
                const dirty_entities = this.store.selectSnapshot(AdminPermissionsStateSelectors.getDirtyEntities)
                const dirty_roles = this.store.selectSnapshot(AdminPermissionsStateSelectors.getDirtyRoles)
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
        this.store.dispatch(new AdminPermissionsRolesStateActions.Add_Entity(name)).toPromise()
            .then(() => {
                /** get dirty role entities */
                const dirty_roles = this.store.selectSnapshot(AdminPermissionsStateSelectors.getDirtyRoles)
                const dirty_entities = this.store.selectSnapshot(AdminPermissionsStateSelectors.getDirtyEntities)
            })
    }
    /**
     * remove role entity
     */
    remove_role_entity(node: AdminPermissionsFlatNode) { }
    /**
     * Add service entity
     */
    add_service_entity(service: BackendServiceModel) {
        const ui_selected_item: AdminPermissionsFlatNode = this.store.selectSnapshot(AdminPermissionsUIState.selected)
        const selected_role_entity: AdminPermissionsEntityTypes = ui_selected_item !== null ? ui_selected_item.item : null

        /** throw error if selected entity is not role or no selection */
        if (selected_role_entity === null || selected_role_entity.entity_type !== ENTITY_TYPES.ROLE) throw new Error('Can not add service because current selected item is not a role entity')

        this.store.dispatch(new AdminPermissionsRolesStateActions.Add_Service(selected_role_entity as AdminPermissionsRoleEntity, service))
    }
    /**
     * remove service entity
     */
    remove_service_entity(node: AdminPermissionsFlatNode) { }

    /** unused but must be implemented */
    protected on_login() { }
    protected on_logout() { }

}