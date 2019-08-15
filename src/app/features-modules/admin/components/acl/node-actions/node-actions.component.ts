import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NODE_TYPES } from '../../../../../shared/models/treenode.model';
import { FlatTreeNode } from '../../../services/treeNodes.service';
import { AclServiceModel } from 'src/app/shared/models/acl.services.model';
import { Observable, of } from 'rxjs';

@Component( {
  selector: 'app-admin-acl-node-actions',
  templateUrl: './node-actions.component.html',
  styleUrls: [ './node-actions.component.scss' ]
} )
export class NodeActionsComponent implements OnInit {
  @Input( 'node' ) node: FlatTreeNode
  @Input( 'availableServices' ) availableServices: AclServiceModel[]
  @Input( 'editable' ) editable$: Observable<boolean> = of( false )
  @Output( 'addRole' ) addRole: EventEmitter<FlatTreeNode> = new EventEmitter<FlatTreeNode>()
  @Output( 'addService' ) addService: EventEmitter<FlatTreeNode> = new EventEmitter<FlatTreeNode>()
  @Output( 'removeRole' ) removeRole: EventEmitter<FlatTreeNode> = new EventEmitter<FlatTreeNode>()
  @Output( 'removeService' ) removeService: EventEmitter<FlatTreeNode> = new EventEmitter<FlatTreeNode>()

  public node_types = NODE_TYPES

  constructor() { }

  ngOnInit() {
  }

  onAddRole() {
    this.addRole.emit( this.node )
  }
  onAddService() {
    this.addService.emit( this.node )
  }
  onRemoveRole() {
    this.removeRole.emit( this.node )
  }
  onRemoveService() {
    this.removeService.emit( this.node )
  }

}
