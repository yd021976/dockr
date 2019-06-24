import { Component } from '@angular/core';
import { MAT_CHECKBOX_CLICK_ACTION, MatCheckboxChange } from '@angular/material/checkbox';
import { ALLOWED_STATES } from 'src/app/shared/models/acl/crud-operations.model';
import { BaseNodeComponent } from '../base.node.component';


@Component( {
  selector: 'app-admin-acl-tree-node-field',
  templateUrl: './field.component.html',
  styleUrls: [ './field.component.scss' ],
  providers: [
    // { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop' }
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
  }
  onCheckChange( event: MatCheckboxChange ) {
    var node = JSON.parse( JSON.stringify( this.node ) )
    node.checked = event.checked == true ? ALLOWED_STATES.ALLOWED : ALLOWED_STATES.FORBIDDEN
    this.checkChange.emit( node )
  }
}
