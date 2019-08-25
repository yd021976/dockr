import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ALLOWED_STATES } from 'src/app/shared/models/acl.service.action.model';
import { BaseNodeComponent } from '../base.node.component';
import { Subscription } from 'rxjs';

@Component( {
  selector: 'app-admin-acl-tree-node-action',
  templateUrl: './action.component.html',
  styleUrls: [ './action.component.scss' ]
} )
export class ActionComponent extends BaseNodeComponent implements OnInit, OnDestroy, OnChanges {
  allowed_states = ALLOWED_STATES
  public checked_state: boolean
  public indeterminate_state: boolean
  public editable: boolean
  protected subscribeFn: Subscription

  ngOnInit() { }

  ngOnDestroy() {
    this.unSubscribe()
  }

  /**
   * Update template variables
   * 
   * @param changes 
   */
  ngOnChanges( changes ) {
    this.checked_state = this._node.checked == ALLOWED_STATES.ALLOWED ? true : false
    this.indeterminate_state = this._node.checked === ALLOWED_STATES.INDETERMINATE

    // Observable changed
    if ( changes[ 'editable$' ] ) {
      this.subscribeFn = this.subscribeEditable$()
    }
  }
  onClick( event: MouseEvent ) {
    event.stopPropagation()
  }

  /**
   * 
   * @param event 
   */
  onCheckChange( event: MatCheckboxChange ) {
    var node = JSON.parse( JSON.stringify( this.node ) )
    node.checked = event.checked == true ? ALLOWED_STATES.ALLOWED : ALLOWED_STATES.FORBIDDEN
    this.checkChange.emit( node )
  }

  /**
   * 
   */
  protected subscribeEditable$(): Subscription {
    this.unSubscribe()

    return this.editable$.subscribe( ( isEditable ) => {
      this.editable = isEditable
    } )
  }
  protected unSubscribe() {
    if ( this.subscribeFn ) this.subscribeFn.unsubscribe()
  }
}
