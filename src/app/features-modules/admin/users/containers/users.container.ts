import { Component, OnInit, Inject } from '@angular/core';
import { Observable, concat } from 'rxjs';
import { UserModelBase } from 'src/app/shared/models/user.model';
import { AclRoleModel } from 'src/app/shared/models/acl.role.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthUsersAddUserDialog, auth_users_add_user_dialog_result } from '../components/dialogs/add.user/add.user.dialog.component';
import { AdminUsersSandboxProviderToken } from '../sandboxes/admin.users.sandbox.token';
import { AdminUsersSandboxInterface } from '../sandboxes/admin.users.sandbox.interface';

@Component( {
  selector: 'app-users-container',
  templateUrl: './users.container.html',
  styleUrls: [ './users.container.scss' ]
} )
export class UsersContainer implements OnInit {
  public users$: Observable<UserModelBase[]>
  public selected_user$: Observable<UserModelBase>
  public available_roles$: Observable<AclRoleModel[]>

  private dialog_add_user: MatDialogRef<AuthUsersAddUserDialog>
  private dialog_remove_user

  /**
   * 
   * @param sandbox 
   * @param dialogService 
   */
  constructor( @Inject( AdminUsersSandboxProviderToken ) public sandbox: AdminUsersSandboxInterface, private dialogService: MatDialog ) {
    this.users$ = this.sandbox.users$
    this.selected_user$ = this.sandbox.selected_user$
    this.available_roles$ = this.sandbox.available_roles$
  }

  ngOnInit() { }

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
  onUserRemove( user: UserModelBase ) {
    this.sandbox.users_remove_user( user )
  }

  /**
   * Add new user
   */
  onUserAdd() {
    if ( !this.dialog_add_user ) {
      // Open the dialog
      this.dialog_add_user = this.dialogService.open( AuthUsersAddUserDialog, { disableClose: true, data: this.available_roles$ } )

      // Handle dialog close and process results
      this.dialog_add_user.afterClosed().subscribe( ( ( dialog_result: auth_users_add_user_dialog_result ) => {
        this.dialog_add_user = null
        if ( !dialog_result.isCancelled ) {
          this.sandbox.users_add_user( dialog_result.user )
        }
      } ) )
    }
  }

}
