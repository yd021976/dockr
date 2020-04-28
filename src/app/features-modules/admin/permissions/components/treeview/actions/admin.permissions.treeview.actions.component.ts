import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { AdminPermissionsFlatNode } from '../../../store/models/admin.permissions.model'

@Component({
    selector: 'app-admin-permissions-treeview-actions',
    templateUrl: './admin.permissions.treeview.actions.component.html',
    styleUrls: ['./admin.permissions.treeview.actions.component.scss'],
    animations: []
})
export class AdminPermissionsTreeviewActionsComponent implements OnChanges {
    @Input('selected-node') public selected_node: AdminPermissionsFlatNode
    public selected_node_type: string = null
    /**
     * On input parameters changes, compute the node type to display action buttons
     * @param changes 
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes['selected_node']) {
            if (this.selected_node === null) {
                this.selected_node_type = null
            } else {
                switch (this.selected_node.item.constructor.name) {
                    case "AdminPermissionsRoleEntity":
                        this.selected_node_type = 'role'
                        break;
                    case "AdminPermissionsServiceEntity":
                        this.selected_node_type = 'service'
                        break;
                    case "AdminPermissionsOperationEntity":
                        this.selected_node_type = 'operation'
                        break;
                    case "AdminPermissionsFieldEntity":
                        this.selected_node_type = 'field'
                        break;
                }
            }
        }
    }
}