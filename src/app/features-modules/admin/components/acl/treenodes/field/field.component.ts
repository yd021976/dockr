import { Component } from '@angular/core';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material/checkbox';
import { AclTreeNode } from 'src/app/shared/models/acl/treenode.model';
import { ALLOWED_STATES } from 'src/app/shared/models/acl/crud-operations.model';
import { Observable } from 'rxjs';
import { BaseNodeComponent } from '../base.node.component';


@Component( {
  selector: 'app-admin-acl-tree-node-field',
  templateUrl: './field.component.html',
  styleUrls: [ './field.component.scss' ],
  providers: [
    { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop' }
  ]
} )
export class FieldComponent extends BaseNodeComponent {

  allowed_states = ALLOWED_STATES

  /**
   * 
   * @param event 
   */
  onClick( event: MouseEvent ) {
    event.stopPropagation() // avoid click event propagate to parent div that select/deselect node
    var node = JSON.parse( JSON.stringify( this.node ) )

    // Just invert check state and emit changes
    node.checked = ( node.checked == ALLOWED_STATES.ALLOWED ? ALLOWED_STATES.FORBIDDEN : ALLOWED_STATES.ALLOWED )
    this.checkChange.emit( node )
  }

}
