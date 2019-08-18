import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModelBase, UserModel } from 'src/app/shared/models/user.model';
import { AclRoleModel } from 'src/app/shared/models/acl.role.model';

@Component( {
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: [ './users.component.scss' ]
} )
export class UsersComponent implements OnInit {
  @Input( 'selected_user$' ) selected_user$: Observable<UserModelBase>
  @Input( 'users$' ) users$: Observable<UserModelBase[]>
  @Input( 'available_roles' ) available_roles$: Observable<AclRoleModel[]>

  @Output( 'user_selected' ) user_selected: EventEmitter<UserModelBase> = new EventEmitter<UserModelBase>()
  @Output( 'user_changed' ) user_changed: EventEmitter<UserModelBase> = new EventEmitter<UserModelBase>()
  @Output( 'user_add' ) user_add: EventEmitter<null> = new EventEmitter<null>()
  @Output( 'user_remove' ) user_remove: EventEmitter<UserModelBase> = new EventEmitter<UserModelBase>()

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
    // TODO: implement search user
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
  onUserRemove( user: UserModelBase ) {
    this.user_remove.emit( user )
  }
  onUserAdd() {
    this.user_add.emit()
  }

}
