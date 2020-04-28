import { Component, ViewChild, OnDestroy, Inject, ChangeDetectorRef, ApplicationRef, OnInit } from '@angular/core';
import { AdminPermissionsSandboxInterface } from '../sandboxes/admin.permissions.sandbox.interface';
import { AdminPermissionsSandboxProviderToken } from '../sandboxes/admin.permissions.sandbox.token';
import { TreeViewColumnModel, AdminPermissionsFlatNode, ALLOWED_STATES } from '../store/models/admin.permissions.model';


@Component({
    selector: 'app-admin-permissions-container',
    templateUrl: './permissions.container.html',
    styleUrls: ['./permissions.container.scss']
})
export class AdminPermissionsContainer implements OnInit, OnDestroy {
    public treeColumnModel: TreeViewColumnModel[]
    public aclLocked$
    constructor(@Inject(AdminPermissionsSandboxProviderToken) public sandbox: AdminPermissionsSandboxInterface) { }
    ngOnInit() {
        this.treeColumnModel = this.setColmodel()
    }
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
}