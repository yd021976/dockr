import { AfterViewInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { BaseTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { MatTreeFlatDataSource, MatTree } from '@angular/material/tree';
import { OnInit } from '@angular/core';
import { TemplateRef } from '@angular/core';

import { FlatTreeNode } from '../../services/treeNodes.service';
import { AclTreeColmodel } from 'src/app/shared/models/acl/acl-tree-colmodel.model';
import { trigger, style, transition, animate } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-admin-acl',
  templateUrl: './acl.component.html',
  styleUrls: ['./acl.component.scss'],
  animations: [
    trigger('EnterLeave', [
      transition(':enter', [
        style({ 'max-height': '0', height: 0, 'min-height': '0px' }),
        animate('0.2s 100ms ease-in', style({ 'min-height': '26px', height: '100%', 'max-height': '26px' }))
      ]),
      transition(':leave', [
        style({ 'max-height': '26px', height: '100%', 'min-height': '26px' }),
        animate('0.2s 100ms ease-out', style({ 'min-height': '0px', height: '0px', 'max-height': '0px' }))
      ])
    ])
  ]
})
export class AclComponent implements OnInit, AfterViewInit {
  @Input('colModel') colmodel: AclTreeColmodel[]
  @Input('maxcol') maxcol = 5
  @Input('nodeTemplateRenderer') nodeTemplateRenderer: TemplateRef<any>
  @Input('treecontrol') treecontrol: BaseTreeControl<any>
  @Input('flatDataSource') flatDataSource: MatTreeFlatDataSource<any, any>
  @Output('nodeSelected') nodeSelected: EventEmitter<FlatTreeNode> = new EventEmitter<FlatTreeNode>()
  @Output('nodeToggled') nodeToggled: EventEmitter<FlatTreeNode> = new EventEmitter<FlatTreeNode>()

  @ViewChild('tree') matTree: MatTree<any>

  private selection: SelectionModel<FlatTreeNode> = new SelectionModel(false, [])
  public selectedNode: FlatTreeNode = null

  constructor() {

    //IMPORTANT: The selection model don't have multi selection mode, so only 1 item could be added and/or removed. Max 2 events will be emmited
    this.selection.onChange.subscribe((changes) => {
      var selectedNode: FlatTreeNode

      // Notify no new node is selected if we have only a removed item and no new selected node
      if (changes.removed.length != 0 && changes.added.length == 0) {
        selectedNode = null
        this.nodeSelected.emit(null)
      } else {
        // Emit event for the new selected node : There can be only one selected node because selection model has no multple selection enabled
        selectedNode = changes.added[0]
      }


      // emit event and update component selected node
      this.selectedNode = selectedNode
      this.nodeSelected.emit(this.selectedNode)
    })
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }
  nodeExpandToggle(node: FlatTreeNode) {
    this.nodeToggled.emit(node)
  }
  /**
   * Select / Deselect node
   * @param node clicked node
   */
  selectNode(node: FlatTreeNode) {
    if (this.selection.isSelected(node)) {
      this.selection.deselect(node)
    } else {
      this.selection.select(node)
    }
  }
  node_ExpandNode(node: FlatTreeNode) {
    this.treecontrol.expand(node)
  }
  hasChild = (index: number, node: FlatTreeNode) => {
    return node.isExpandable
  }
  node_getDescendants(node: FlatTreeNode): number {
    const children = this.treecontrol.getDescendants(node)
    return children.length
  }
  getColmunsBeforeNode(node: FlatTreeNode): AclTreeColmodel[] {
    // If first level, there is no columns before node
    if (node.level == 0) return []

    var cols = this.colmodel.slice(0, node.level)
    return cols
  }
  getColumnsAfterNode(node: FlatTreeNode): AclTreeColmodel[] {
    // If last level, there is no remaining columns
    if ((node.level + 1) >= this.colmodel.length) return []

    var cols = this.colmodel.slice(node.level + 1)
    return cols
  }
}
