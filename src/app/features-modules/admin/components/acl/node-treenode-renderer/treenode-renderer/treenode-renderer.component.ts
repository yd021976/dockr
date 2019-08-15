import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FlatTreeNode } from 'src/app/features-modules/admin/services/treeNodes.service';

@Component( {
  selector: 'app-admin-acl-treenode-renderer',
  templateUrl: './treenode-renderer.component.html',
  styleUrls: [ './treenode-renderer.component.css' ]
} )
export class TreenodeRendererComponent implements OnInit {
  @Input( 'node' ) public node: FlatTreeNode
  @Input( 'selected-node' ) selectedNode: FlatTreeNode = null
  @Input( 'nodeTemplateRenderer' ) public nodeTemplateRenderer: TemplateRef<any>
  @Output( 'selectNode' ) public selectNode: EventEmitter<FlatTreeNode> = new EventEmitter<FlatTreeNode>()


  constructor() { }

  ngOnInit() {

  }

  /**
   * 
   * @param node 
   */
  public nodeSelected( node: FlatTreeNode ) {
    this.selectNode.emit( node )
  }
}
