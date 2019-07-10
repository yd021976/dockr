import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModelBase } from 'src/app/shared/models/user.model';
import { RoleModel } from 'src/app/shared/models/acl/roles.model';

@Component( {
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: [ './users.component.scss' ]
} )
export class UsersComponent implements OnInit {
  @Input( 'selected_user$' ) selected_user$: Observable<UserModelBase>
  @Input( 'users$' ) users$: Observable<UserModelBase[]>
  @Input( 'available_roles' ) available_roles$: Observable<RoleModel[]>

  @Output( 'user_selected' ) user_selected: EventEmitter<UserModelBase> = new EventEmitter<UserModelBase>()
  @Output( 'user_changed' ) user_changed: EventEmitter<UserModelBase> = new EventEmitter<UserModelBase>()
  @Output( 'user_add' ) user_add: EventEmitter<null> = new EventEmitter<null>()
  @Output( 'user_remove' ) user_remove: EventEmitter<null> = new EventEmitter<null>()

  /**
   * 
   */
  constructor() { }

  /**
   * 
   */
  ngOnInit() {
  }

  onSearchChange( text ) {
    let a = 0
  }
  /**
   * User is selected in the users list
   * 
   * @param user 
   */
  onUserSelected( user: UserModelBase ) {
    this.user_selected.emit( user )
  }

  /**
   * User details changed
   * 
   * @param event 
   */
  onUserChanged( user: UserModelBase ) {
    this.user_changed.emit( user )
  }
  onUserRemove() {
    this.user_remove.emit()
  }
  onUserAdd() {
    this.user_add.emit()
  }

}
