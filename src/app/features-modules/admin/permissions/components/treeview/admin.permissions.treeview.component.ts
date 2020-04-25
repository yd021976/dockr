import { Component, Input, Output, ViewChild, TemplateRef, EventEmitter } from "@angular/core";
import { MatTree, MatTreeFlatDataSource } from "@angular/material/tree";
import { TreeViewColumnModel, AdminPermissionsFlatNode, AdminPermissionsEntityTypes } from '../../store/models/admin.permissions.model'
import { BaseTreeControl } from "@angular/cdk/tree";
import { nodeAnimations } from './admin.permissions.tree.animations';

@Component({
    selector: 'app-admin-permissions-treeview',
    templateUrl: './admin.permissions.treeview.component.html',
    styleUrls: ['./admin.permissions.treeview.component.scss'],
    animations: nodeAnimations
})
export class AdminPermissionsTreeviewComponent {
    @Input('columnModel') columnModel: TreeViewColumnModel[] = []
    // @Output('nodeToggled') nodeToggled: EventEmitter<AdminPermissionsFlatNode> = new EventEmitter<AdminPermissionsFlatNode>()

    @Input('treecontrol') treecontrol: BaseTreeControl<AdminPermissionsFlatNode>
    @Input('datasource') datasource: MatTreeFlatDataSource<AdminPermissionsEntityTypes, AdminPermissionsFlatNode>
    @Input('selectedNode') selectedNode: AdminPermissionsFlatNode
    @Input('hasChild') hasChild: (number, AdminPermissionsFlatNode) => boolean = () => { return false }
    @Output('nodeSelected') nodeSelected: EventEmitter<AdminPermissionsFlatNode> = new EventEmitter<AdminPermissionsFlatNode>()
    @Output('checked') checked: EventEmitter<AdminPermissionsFlatNode> = new EventEmitter<AdminPermissionsFlatNode>()

    @ViewChild('tree', { static: true }) matTree: MatTree<any>

    public select(node: AdminPermissionsFlatNode) {
        this.nodeSelected.emit(node)
    }

    public checkChange(node: AdminPermissionsFlatNode, checked: boolean) {
        this.checked.emit(node)
    }
}