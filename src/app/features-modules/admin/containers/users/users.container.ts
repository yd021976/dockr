import { Component, OnInit } from '@angular/core';
import { AdminUsersSandboxService } from 'src/app/shared/sandboxes/containers/admin.users.sandbox.service';
import { Observable } from 'rxjs';
import { UserModelBase } from 'src/app/shared/models/user.model';
import { RoleModel } from 'src/app/shared/models/acl/roles.model';

@Component( {
  selector: 'app-users-container',
  templateUrl: './users.container.html',
  styleUrls: [ './users.container.scss' ]
} )
export class UsersContainer implements OnInit {
  public users$: Observable<UserModelBase[]>
  public selected_user$: Observable<UserModelBase>
  public available_roles$: Observable<RoleModel[]>

  constructor( public sandbox: AdminUsersSandboxService ) {
    this.users$ = this.sandbox.users$
    this.selected_user$ = this.sandbox.selected_user$
    this.available_roles$ = this.sandbox.available_roles$
  }

  ngOnInit() {
    this.sandbox.init()
  }

  /**
   * select a user
   * @param user 
   */
  onUserSelected( user: UserModelBase ) {
    this.sandbox.select_user( user )
  }

  /**
   * 
   */
  onUserUpdate( user: UserModelBase ) {
    this.sandbox.users_update_user( user )
  }

  /**
   * Remove current selected user
   */
  onUserRemove() { }

  /**
   * Add new user
   */
  onUserAdd() { }

}
