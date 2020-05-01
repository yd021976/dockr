import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { AdminPermissionsFlatNode, ENTITY_TYPES, EntityActionTypes } from '../../../store/models/admin.permissions.model'

/**
 * 
 */
export interface IActionClick {
    node:AdminPermissionsFlatNode /** the node the action relies on */
    action: EntityActionTypes /** the click action type */
}


/**
 * 
 */
@Component({
    selector: 'app-admin-permissions-treeview-actions',
    templateUrl: './admin.permissions.treeview.actions.component.html',
    styleUrls: ['./admin.permissions.treeview.actions.component.scss'],
    animations: []
})
export class AdminPermissionsTreeviewActionsComponent implements OnChanges {
    @Input('selected-node') public selected_node: AdminPermissionsFlatNode
    @Output('on-action-click') public on_action_click: EventEmitter<IActionClick> = new EventEmitter<IActionClick>()
    public selected_node_type: ENTITY_TYPES = null
    public entity_types = ENTITY_TYPES
    public action_types = EntityActionTypes

    onActionClick(action: IActionClick) {
        this.on_action_click.emit(action)
    }
    /**
     * On input parameters changes, compute the node type to display action buttons
     * @param changes 
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes['selected_node']) {
            this.selected_node_type = this.selected_node === null ? null : this.selected_node.item.entity_type
        }
    }
}