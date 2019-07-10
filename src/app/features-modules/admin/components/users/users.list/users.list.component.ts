import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModelBase } from 'src/app/shared/models/user.model';

@Component( {
  selector: 'app-admin-users-list',
  templateUrl: './users.list.component.html',
  styleUrls: [ './users.list.component.scss' ]
} )
export class UsersListComponent implements OnInit {
  @Input( 'users' ) users: UserModelBase[]
  @Input( 'selected_user' ) selected_user: UserModelBase
  @Output( 'user_selected' ) user_selected: EventEmitter<UserModelBase> = new EventEmitter<UserModelBase>()

  /**
   * 
   */
  constructor() { }

  /**
   * 
   */
  ngOnInit() {
  }

  /**
   * 
   * @param user 
   */
  onUserClick( user ) {
    let selected_user = user == this.selected_user ? null : user;
    this.user_selected.emit( selected_user )
  }

}
