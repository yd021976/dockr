import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AclTreeNode } from 'src/app/shared/models/acl/treenode.model';
import { MatCheckboxChange } from '@angular/material';
import { ALLOWED_STATES } from 'src/app/shared/models/acl/crud-operations.model';

@Component( {
  selector: 'app-admin-acl-tree-node-action',
  templateUrl: './action.component.html',
  styleUrls: [ './action.component.scss' ]
} )
export class ActionComponent implements OnInit, OnDestroy {
  @Input()
  get node(): AclTreeNode { return this._node }
  set node( node: AclTreeNode ) { this._node = node }

  allowed_states = ALLOWED_STATES
  @Output( 'checkChange' ) checkChange: EventEmitter<AclTreeNode> = new EventEmitter<AclTreeNode>()

  public _node: AclTreeNode

  constructor() { }
  ngOnDestroy() { }

  ngOnInit() { }

  onClick( event: MouseEvent ) {
    event.stopPropagation()
  }
  onCheckChange( event: MatCheckboxChange ) {
    this._node.checked = event.checked == true ? ALLOWED_STATES.ALLOWED : ALLOWED_STATES.FORBIDDEN
    this.checkChange.emit( this._node )
  }
}
