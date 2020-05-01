import { Component, ViewChild, OnDestroy, Inject, ChangeDetectorRef, ApplicationRef, OnInit } from '@angular/core';
import { AdminPermissionsSandboxInterface } from '../sandboxes/admin.permissions.sandbox.interface';
import { AdminPermissionsSandboxProviderToken } from '../sandboxes/admin.permissions.sandbox.token';
import { TreeViewColumnModel, AdminPermissionsFlatNode, ALLOWED_STATES, EntityActionTypes, ENTITY_TYPES } from '../store/models/admin.permissions.model';
import { IActionClick } from '../components/treeview/actions/admin.permissions.treeview.actions.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdminPermissionsAddRoleDialogComponent, dialogResult } from '../components/dialogs/add.role/add.role.dialog.component';

@Component({
    selector: 'app-admin-permissions-container',
    templateUrl: './permissions.container.html',
    styleUrls: ['./permissions.container.scss']
})
export class AdminPermissionsContainer implements OnInit, OnDestroy {
    public treeColumnModel: TreeViewColumnModel[]
    public aclLocked$

    // private dialog_AddService: MatDialogRef<AddServiceDialogComponent>
    // private dialog_candeactivateAcl: MatDialogRef<CandeactivateAclDialog>
    private dialog_add_role: MatDialogRef<AdminPermissionsAddRoleDialogComponent>

    /**
     * 
     * 
     */
    constructor(@Inject(AdminPermissionsSandboxProviderToken) public sandbox: AdminPermissionsSandboxInterface, protected dialog_service: MatDialog) { }

    /**
     * 
     */
    ngOnInit() {
        this.treeColumnModel = this.setColmodel()
    }

    /**
     * 
     */
    ngOnDestroy() { }


    /**
     * A node check has been inverted.
     * @param node 
     */
    public checkChange(node: AdminPermissionsFlatNode) {
        /** invert node status */
        const new_allowed_status = node.item.allowed == ALLOWED_STATES.ALLOWED ? ALLOWED_STATES.FORBIDDEN : ALLOWED_STATES.ALLOWED

        /** update node data */
        this.sandbox.node_update_allowed(node, new_allowed_status)
    }
    /**
     * 
     */
    onNodeActionClick(action: IActionClick) {
        /** add role */
        if (action.node===null && action.action==EntityActionTypes.ADD){
            this.add_role_dialog()
            return /** exit here as action is handled */
        }
        switch (action.node.item.entity_type) {
            case ENTITY_TYPES.ROLE:
                switch (action.action) {
                    case EntityActionTypes.REMOVE:
                        this.remove_role_entity(action.node)
                        break
                }
                break
            case ENTITY_TYPES.SERVICE:
                switch (action.action) {
                    case EntityActionTypes.ADD:
                        this.add_service_entity(action.node)
                        break
                    case EntityActionTypes.REMOVE:
                        this.remove_service_entity(action.node)
                        break
                }
                break
        }
    }
    /**
     * 
     */
    public selectNode(node: AdminPermissionsFlatNode) {
        this.sandbox.selectNode(node)
    }

    /**
     * 
     */
    public lock() {
        return this.sandbox.lock_ressource()
    }

    /**
     * 
     */
    public unlock() {
        return this.sandbox.unlock_ressource()
    }
    private setColmodel(): TreeViewColumnModel[] {
        return [
            {
                colName: 'Role',
                size: '100px'
            },
            {
                colName: 'Service',
                size: '150px'
            },
            {
                colName: 'Action',
                size: '150px'
            },
            {
                colName: 'Fields',
                size: '300px'
            }
        ]
    }

    /**
     * Open add role dialog
     */
    private add_role_dialog() {
        if (!this.dialog_add_role) {
            this.dialog_add_role = this.dialog_service.open(AdminPermissionsAddRoleDialogComponent, { disableClose: true })
            this.dialog_add_role.afterClosed().subscribe((data: dialogResult) => {
                if (!data.cancelled && data.result != '') {
                    this.sandbox.add_role_entity(data.result)
                }
                this.dialog_add_role = null // dialog is closed, clear dialog ref object
            })
        }
    }

    /**
     * 
     */
    private remove_role_entity(node: AdminPermissionsFlatNode) { }

    /**
     * 
     */
    private add_service_entity(node: AdminPermissionsFlatNode) { }

    /**
     * 
     */
    private remove_service_entity(node: AdminPermissionsFlatNode) { }
}