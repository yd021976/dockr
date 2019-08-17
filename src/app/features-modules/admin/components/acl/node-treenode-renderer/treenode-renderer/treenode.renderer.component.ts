import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, OnChanges, SimpleChanges } from '@angular/core';
import { FlatTreeNode } from 'src/app/features-modules/admin/services/treeNodes.service';

@Component( {
  selector: 'app-admin-acl-treenode-renderer',
  templateUrl: './treenode.renderer.component.html',
  styleUrls: [ './treenode.renderer.component.scss' ]
} )
export class TreenodeRendererComponent implements OnInit, OnChanges {
  @Input( 'node' ) public node: FlatTreeNode
  @Input( 'selected-node' ) public selectedNode: FlatTreeNode = null
  @Input( 'nodeTemplateRenderer' ) public nodeTemplateRenderer: TemplateRef<any>
  @Input( 'expanded' ) public isExpanded: boolean = false
  @Output( 'selectNode' ) public selectNode: EventEmitter<FlatTreeNode> = new EventEmitter<FlatTreeNode>()

  public isSelected: boolean // is this node is the selected node ?
  public buttonFontIcon: string // icon to display for states : expanded/collapsed or not expandable (spacer)

  constructor() { }

  ngOnInit() {
    this.isNodeSelected()
    this.setIconFont()
  }
  ngOnChanges( changes: SimpleChanges ) {
    if ( changes[ 'selectedNode' ] ) { this.isNodeSelected() }
    if ( changes[ 'node' ] ) {
      this.isNodeSelected()
      this.setIconFont()
    }
    if ( changes[ 'expandable' ] || changes[ 'expanded' ] ) {
      this.setIconFont()
    }
  }

  private isNodeSelected(): void {
    this.isSelected = this.selectedNode == this.node ? true : false
  }
  private setIconFont() {
    if ( this.node.isExpandable ) {
      this.buttonFontIcon = this.isExpanded ? 'fa-minus-circle' : 'fa-plus-circle'
    } else {
      this.buttonFontIcon = 'fa-fw'
    }
  }
  /**
   * 
   * @param node 
   */
  public nodeSelected() {
    this.selectNode.emit( this.node )
  }
  public nodeExpandToggle() {
    this.setIconFont()
  }

}
