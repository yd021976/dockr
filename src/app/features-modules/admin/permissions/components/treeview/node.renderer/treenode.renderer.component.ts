import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { AdminPermissionsFlatNode, TreeViewColumnModel, NodeTreeviewColumnModel } from '../../../store/models/admin.permissions.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ALLOWED_STATES } from 'src/app/shared/models/acl.service.action.model';

@Component({
  selector: 'app-admin-permissions-treeview-node-renderer',
  templateUrl: './treenode.renderer.component.html',
  styleUrls: ['./treenode.renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AdminPermissionsTreeviewNodeRenderer implements OnInit, OnChanges {
  @Input('node') public node: AdminPermissionsFlatNode
  @Input('selected-node') public selectedNode: AdminPermissionsFlatNode = null
  @Input('node-type-renderer') public nodeType_renderer: TemplateRef<any>
  @Input('column-model') public column_model: TreeViewColumnModel[]
  @Input('tree-control') public treeControl: FlatTreeControl<AdminPermissionsFlatNode>
  @Output('node-selected') public nodeSelected: EventEmitter<AdminPermissionsFlatNode> = new EventEmitter<AdminPermissionsFlatNode>()
  @Output('checked') public checked: EventEmitter<string | boolean> = new EventEmitter<string | boolean>()

  public allowed_states = ALLOWED_STATES
  public isExpanded: boolean = false
  public isSelected: boolean // is this node is the selected node ?
  public buttonFontIcon: string // icon to display for states : expanded/collapsed or not expandable (spacer)
  public node_column_model: NodeTreeviewColumnModel

  constructor() { }
  private checkInputParameters() {
    if (this.column_model == null || (this.column_model && this.column_model.length) == 0) throw new Error('[TreenodeRendererComponent] <column-model> Input is required')
    if (!this.node) throw new Error('[TreenodeRendererComponent] <node> Input is required')
    if (!this.treeControl) throw new Error('[TreenodeRendererComponent] <tree-control> Input is required')
  }
  ngOnInit() {
    // Check required input parameters
    this.checkInputParameters()
    this.isExpanded = this.treeControl.isExpanded(this.node)
    this.isNodeSelected()
    this.setNodeIcon()
    this.compute_column_model()
  }

  /**
   * Tree node checkbox change status
   * @param status 
   */
  public checkChange(status: MatCheckboxChange) {
    this.checked.emit(status.checked)
  }
  /**
   * 
   */
  public onNodeSelected() {
    this.nodeSelected.emit(this.node)
  }

  /**
   * 
   */
  public nodeExpandToggle() {
    this.isExpanded = this.treeControl.isExpanded(this.node)
    this.setNodeIcon()
  }



  /**
   * Update some properties when input changes
   * 
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges) {
    // Check required input parameters  
    this.checkInputParameters()

    if (changes['selectedNode']) { this.isNodeSelected() }
    if (changes['node']) {
      this.isNodeSelected()
      this.setNodeIcon()
      this.compute_column_model()
    }
    if (changes['expandable'] || changes['expanded']) {
      this.setNodeIcon()
    }
    if (changes['column_model']) {
      this.compute_column_model()
    }
  }

  /**
   * 
   */
  private isNodeSelected(): void {
    this.isSelected = this.selectedNode == this.node ? true : false
  }

  /**
   * 
   */
  private setNodeIcon() {
    if (this.node.expandable) {
      this.buttonFontIcon = this.isExpanded ? 'fa-minus-circle' : 'fa-plus-circle'
    } else {
      this.buttonFontIcon = 'fa-fw'
    }
  }


  /**
   * 
   * @param node 
   */
  private compute_column_model(): void {
    let col_size: string, cols_before: TreeViewColumnModel[], cols_after: TreeViewColumnModel[], node_indent: number
    const columns_before = (node: AdminPermissionsFlatNode) => {
      if (node.level == 0) return []
      var cols = this.column_model.slice(0, node.level >= this.column_model.length ? this.column_model.length - 1 : node.level)
      return cols
    }

    const columns_after = (node: AdminPermissionsFlatNode) => {
      // If last level, there is no remaining columns
      if ((node.level + 1) >= this.column_model.length) return []

      var cols = this.column_model.slice(node.level + 1)
      return cols
    }

    // compute properties
    col_size = this.node.level >= this.column_model.length ? this.column_model[this.column_model.length - 1].size : this.column_model[this.node.level].size
    node_indent = this.node.level >= this.column_model.length ? (this.node.level - (this.column_model.length - 1)) * 25 : 0
    cols_after = columns_after(this.node)
    cols_before = columns_before(this.node)

    // create column model for node
    let column_model: NodeTreeviewColumnModel = {
      column_model: this.column_model,
      columns_before_node: cols_before,
      columns_after_node: cols_after,
      column_size: col_size,
      node_padding_left: node_indent
    }

    this.node_column_model = column_model
  }
}
