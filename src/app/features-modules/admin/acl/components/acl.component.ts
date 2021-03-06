import { AfterViewInit, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { BaseTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { MatTreeFlatDataSource, MatTree } from '@angular/material/tree';
import { OnInit } from '@angular/core';
import { TemplateRef } from '@angular/core';

import { AclTreeColmodel } from 'src/app/shared/models/acl-tree-colmodel.model';
import { trigger, style, transition, animate, query, animateChild, group } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeNode } from 'src/app/shared/models/treenode.model';


@Component( {
  selector: 'app-admin-acl',
  templateUrl: './acl.component.html',
  styleUrls: [ './acl.component.scss' ],
  changeDetection: ChangeDetectionStrategy.Default,
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
          query( '@*', animateChild(), { optional: true } ),
          animate( '0.3s 50ms ease', style( { 'max-height': '*', 'min-height': '*', 'height': '*' } ) )
        ] )
      ] ),
      transition( ':leave', [
        style( { 'min-height': '*' } ),
        group( [
          query( '@*', animateChild(), { optional: true } ),
          animate( '0.3s 50ms ease', style( { 'min-height': '0px', 'height': '0px' } ) )
        ] )
      ] )
    ] )
  ]
} )
export class AclComponent implements OnInit, AfterViewInit {
  @Input( 'colmodel' ) colmodel: AclTreeColmodel[]
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
    this.selection.changed.subscribe( ( changes ) => {
      var selectedNode: FlatTreeNode

      // Notify no new node is selected if we have only a removed item and no new selected node
      if ( changes.removed.length != 0 && changes.added.length == 0 ) {
        selectedNode = null
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

  node_getDescendants( node: FlatTreeNode ): number {
    const children = this.treecontrol.getDescendants( node )
    return children.length
  }
  node_isExpanded( node: FlatTreeNode ): boolean {
    console.log( '[app-admin-acl] node is expanded', node.data.name )
    return this.treecontrol.isExpanded( node )
  }
}
