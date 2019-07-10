import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ALLOWED_STATES } from 'src/app/shared/models/acl/crud-operations.model';
import { BaseNodeComponent } from '../base.node.component';

@Component( {
  selector: 'app-admin-acl-tree-node-action',
  templateUrl: './action.component.html',
  styleUrls: [ './action.component.scss' ]
} )
export class ActionComponent extends BaseNodeComponent implements OnInit, OnDestroy {
  allowed_states = ALLOWED_STATES

  ngOnDestroy() { }

  ngOnInit() { }

  onClick( event: MouseEvent ) {
    event.stopPropagation()
  }
  onCheckChange( event: MatCheckboxChange ) {
    var node = JSON.parse( JSON.stringify( this.node ) )
    node.checked = event.checked == true ? ALLOWED_STATES.ALLOWED : ALLOWED_STATES.FORBIDDEN
    this.checkChange.emit( node )
  }
}
