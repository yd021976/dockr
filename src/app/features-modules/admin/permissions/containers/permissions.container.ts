import { Component, ViewChild, OnDestroy, Inject, ChangeDetectorRef, ApplicationRef, OnInit } from '@angular/core';
import { AdminPermissionsSandboxInterface } from '../sandboxes/admin.permissions.sandbox.interface';
import { AdminPermissionsSandboxProviderToken } from '../sandboxes/admin.permissions.sandbox.token';
import { TreeViewColumnModel } from '../store/models/admin.permissions.model';


@Component({
    selector: 'app-admin-permissions-container',
    templateUrl: './permissions.container.html',
    styleUrls: ['./permissions.container.scss']
})
export class AdminPermissionsContainer implements OnInit, OnDestroy {
    public treeColumnModel: TreeViewColumnModel[]

    constructor(@Inject(AdminPermissionsSandboxProviderToken) public sandbox: AdminPermissionsSandboxInterface) { }
    ngOnInit() {
        this.treeColumnModel = this.setColmodel()
    }
    ngOnDestroy() { }

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