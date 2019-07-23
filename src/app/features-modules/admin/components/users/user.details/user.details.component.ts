import * as _ from 'lodash';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { UserModelBase } from 'src/app/shared/models/user.model';
import { RoleModel, RoleModelSelection } from 'src/app/shared/models/acl/roles.model';
import { MatSelectionListChange } from '@angular/material/list';


@Component( {
  selector: 'app-admin-user-details',
  templateUrl: './user.details.component.html',
  styleUrls: [ './user.details.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class UserDetailsComponent implements OnInit {
  /**
   * 
   */
  @Input( 'user' )
  set user( user: UserModelBase ) {
    // Because of state immutability, we clone user object
    this._user = _.cloneDeep( user )
  }
  get user() {
    return this._user
  }

  /**
   * 
   */
  @Input( 'available_roles' ) available_roles: RoleModel[]


  // Emit event whenever user property change (emit a new user entity because we don't mutate the user input from state)
  @Output( 'user_changed' ) user_changed: EventEmitter<UserModelBase> = new EventEmitter<UserModelBase>()

  private _user: UserModelBase
  /**
   * 
   */
  constructor() { }

  /**
   * 
   */
  ngOnInit() { }

  /**
   * Role selection option is checked/unchecked
   * 
   * @param selection 
   */
  roleSelectionChange( selection: MatSelectionListChange ): void {
    if ( selection.option.selected ) {
      this._user.roles.push( selection.option.value )
    } else {
      let index = this._user.roles.findIndex( ( user_role ) => user_role == selection.option.value )
      if ( index != -1 ) this._user.roles.splice( index, 1 )
    }
    this.onUserChange( this._user )
  }

  public onUserChange( user: UserModelBase): void {
    this.user_changed.emit( user )
  }

  /********************************************************
   *            Component template getters
   *******************************************************/
  public userHasRole( user: UserModelBase, role: RoleModel ) {
    const index = user.roles.findIndex( user_role => user_role == role._id )
    return index == -1 ? false : true
  }
}
