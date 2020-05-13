import { Component, ViewChild, OnDestroy, Inject, ChangeDetectorRef, ApplicationRef, OnInit } from '@angular/core';
import { AdminPermissionsSandboxInterface } from '../sandboxes/admin.permissions.sandbox.interface';
import { AdminPermissionsSandboxProviderToken } from '../sandboxes/admin.permissions.sandbox.token';
import { TreeViewColumnModel, AdminPermissionsFlatNode, ALLOWED_STATES, EntityActionTypes, ENTITY_TYPES } from '../store/models/admin.permissions.model';
import { IActionClick } from '../components/treeview/actions/admin.permissions.treeview.actions.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdminPermissionsAddRoleDialogComponent, dialogResult } from '../components/dialogs/add.role/add.role.dialog.component';
import { AdminPermissionsAddServiceDialogComponent, dialog_add_service_result } from '../components/dialogs/add.service/add.service.dialog.component';
import { ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-admin-permissions-container',
    templateUrl: './permissions.container.html',
    styleUrls: ['./permissions.container.scss']
})
export class AdminPermissionsContainer implements OnInit, OnDestroy {
    public treeColumnModel: TreeViewColumnModel[]
    public aclLocked$

    // private dialog_candeactivateAcl: MatDialogRef<CandeactivateAclDialog>
    private dialog_add_service: MatDialogRef<AdminPermissionsAddServiceDialogComponent>
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
        switch (action.action) {
            case EntityActionTypes.ADD_ROLE:
                this.add_role_dialog()
                break
            case EntityActionTypes.REMOVE_ROLE:
                this.remove_role_entity(action.node)
                break
            case EntityActionTypes.ADD_SERVICE:
                this.add_service_dialog(action.node)
                break
            case EntityActionTypes.REMOVE_SERVICE:
                this.remove_service_entity(action.node)
                break
            default:
                throw new Error('Action <' + action.action + '> is unknown')
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

    /**
     * cancel state changes
     */
    public cancel_changes() {
        this.sandbox.cancel_update()
    }

    /**
     * Save state changes
     */
    public save_changes() {
        this.sandbox.save_changes()
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
            this.dialog_add_role = this.dialog_service.open(AdminPermissionsAddRoleDialogComponent, {
                disableClose: true, data: {
                    validator: this.isRoleNameValid
                }
            })
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
    private remove_role_entity(node: AdminPermissionsFlatNode) {
        this.sandbox.remove_role_entity(node)
    }

    /**
     * 
     */
    private add_service_dialog(node: AdminPermissionsFlatNode) {
        if (!this.dialog_add_service) {
            this.dialog_add_service = this.dialog_service.open(AdminPermissionsAddServiceDialogComponent, {
                data: this.sandbox.available_services$,
                disableClose: true
            })
            this.dialog_add_service.afterClosed().subscribe((data: dialog_add_service_result) => {
                if (!data.cancelled && data.result != null) {

                    this.sandbox.add_service_entity(data.result)
                    // this.treeComponent.node_ExpandNode( node )
                }
                this.dialog_add_service = null
            })
        }
    }

    /**
     * 
     */
    private remove_service_entity(node: AdminPermissionsFlatNode) {
        this.sandbox.remove_service_entity(node)
    }

    public isRoleNameValid = (): ValidatorFn => {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (this.sandbox.role_exists(control.value)) {
                return { 'invalid_role_name': true }
            }
            return null
        }
    }
}