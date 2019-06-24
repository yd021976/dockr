import { AfterViewInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { BaseTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { MatTreeFlatDataSource, MatTree } from '@angular/material/tree';
import { OnInit } from '@angular/core';
import { TemplateRef } from '@angular/core';

import { FlatTreeNode } from '../../services/treeNodes.service';
import { AclTreeColmodel } from 'src/app/shared/models/acl/acl-tree-colmodel.model';
import { trigger, style, transition, animate, query, animateChild, group } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';


@Component( {
  selector: 'app-admin-acl',
  templateUrl: './acl.component.html',
  styleUrls: [ './acl.component.scss' ],
  animations: [
    trigger( 'animChildren', [
      transition( '*<=>*',
        [
          query( '@*', animateChild(), { optional: true } )
        ] )
    ] ),
    trigger( 'EnterLeave', [
      transition( ':enter', [
        style( { 'min-height': '0px', 'max-height': '0px', 'height': '0px' } ),
        group( [
          query( "@*", animateChild(), { optional: true } ),
          animate( '0.3s 50ms ease', style( { 'max-height': '*', 'min-height': '*', 'height': '*' } ) )
        ] )
      ] ),
      transition( ':leave', [
        style( { 'min-height': '*' } ),
        group( [
          query( "@*", animateChild(), { optional: true } ),
          animate( '0.3s 50ms ease', style( { 'min-height': '0px', 'height': '0px' } ) )
        ] )
      ] )
    ] )
  ]
} )
export class AclComponent implements OnInit, AfterViewInit {
  @Input( 'colModel' ) colmodel: AclTreeColmodel[]
  @Input( 'nodeTemplateRenderer' ) nodeTemplateRenderer: TemplateRef<any>
  @Input( 'treecontrol' ) treecontrol: BaseTreeControl<any>
  @Input( 'flatDataSource' ) flatDataSource: MatTreeFlatDataSource<any, any>
  
  @Output( 'nodeSelected' ) nodeSelected: EventEmitter<FlatTreeNode> = new EventEmitter<FlatTreeNode>()
  @Output( 'nodeToggled' ) nodeToggled: EventEmitter<FlatTreeNode> = new EventEmitter<FlatTreeNode>()

  @ViewChild( 'tree', { static: true } ) matTree: MatTree<any>


  private selection: SelectionModel<FlatTreeNode> = new SelectionModel( false, [] )
  public colOverflowIndent: number = 25 // pixel indent for each node level that exceed <colmodel> length => This prevent levels > colmodel length to be displayed in new columns
  public selectedNode: FlatTreeNode = null

  constructor() {

    //IMPORTANT: The selection model don't have multi selection mode, so only 1 item could be added and/or removed. Max 2 events will be emmited
    this.selection.onChange.subscribe( ( changes ) => {
      var selectedNode: FlatTreeNode

      // Notify no new node is selected if we have only a removed item and no new selected node
      if ( changes.removed.length != 0 && changes.added.length == 0 ) {
        selectedNode = null
        this.nodeSelected.emit( null )
      } else {
        // Emit event for the new selected node : There can be only one selected node because selection model has no multple selection enabled
        selectedNode = changes.added[ 0 ]
      }


      // emit event and update component selected node
      this.selectedNode = selectedNode
      this.nodeSelected.emit( this.selectedNode )
    } )
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }
  nodeExpandToggle( node: FlatTreeNode ) {
    this.nodeToggled.emit( node )
  }
  /**
   * Select / Deselect node
   * @param node clicked node
   */
  selectNode( node: FlatTreeNode ) {
    if ( this.selection.isSelected( node ) ) {
      this.selection.deselect( node )
    } else {
      this.selection.select( node )
    }
  }
  node_ExpandNode( node: FlatTreeNode ) {
    this.treecontrol.expand( node )
  }
  hasChild = ( index: number, node: FlatTreeNode ) => {
    return node.isExpandable
  }
  node_getDescendants( node: FlatTreeNode ): number {
    const children = this.treecontrol.getDescendants( node )
    return children.length
  }
  getColmunsBeforeNode( node: FlatTreeNode ): AclTreeColmodel[] {
    // If first level, there is no columns before node
    if ( node.level == 0 ) return []

    var cols = this.colmodel.slice( 0, node.level >= this.colmodel.length ? this.colmodel.length - 1 : node.level )
    return cols
  }
  getColumnsAfterNode( node: FlatTreeNode ): AclTreeColmodel[] {
    // If last level, there is no remaining columns
    if ( ( node.level + 1 ) >= this.colmodel.length ) return []

    var cols = this.colmodel.slice( node.level + 1 )
    return cols
  }
}
