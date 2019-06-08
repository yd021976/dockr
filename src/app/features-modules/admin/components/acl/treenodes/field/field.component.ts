import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material/checkbox';
import { AclTreeNode } from 'src/app/shared/models/acl/treenode.model';
import { ALLOWED_STATES } from 'src/app/shared/models/acl/crud-operations.model';


@Component( {
  selector: 'app-admin-acl-tree-node-field',
  templateUrl: './field.component.html',
  styleUrls: [ './field.component.scss' ],
  providers: [
    { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop' }
  ]
} )
export class FieldComponent implements OnInit {
  @Input( 'node' ) node: AclTreeNode

  @Output() fieldCheckChange: EventEmitter<AclTreeNode> = new EventEmitter<AclTreeNode>()
  allowed_states = ALLOWED_STATES

  constructor() {
  }

  /**
   * 
   */
  ngOnInit() {
  }


  /**
   * 
   * @param event 
   */
  onClick( event: MouseEvent ) {
    event.stopPropagation() // avoid click event propagate to parent div that select/deselect node
    var node = JSON.parse( JSON.stringify( this.node ) )

    // Just invert check state and emit changes
    node.checked = ( node.checked == ALLOWED_STATES.ALLOWED ? ALLOWED_STATES.FORBIDDEN : ALLOWED_STATES.ALLOWED )
    this.fieldCheckChange.emit( node )
  }

}
