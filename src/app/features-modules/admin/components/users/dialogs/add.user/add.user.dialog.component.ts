import { Component, ViewChild, ElementRef, Inject } from "@angular/core";
import { UserBackendApiModel, UserModelBase } from "src/app/shared/models/user.model";
import { AclRoleModel } from "src/app/shared/models/acl.role.model";
import { MAT_DIALOG_DATA, MatSelectionListChange } from '@angular/material';
import { Observable, of } from "rxjs";

export type auth_users_add_user_dialog_result = {
    isCancelled: boolean,
    user: UserModelBase,
    available_roles: Observable<AclRoleModel[]>
}
@Component( {
    selector: 'app-admin-users-add-user-dialog',
    templateUrl: './add.user.dialog.component.html',
    styleUrls: [ './add.user.dialog.component.scss' ]
} )
export class AuthUsersAddUserDialog {
    @ViewChild( 'submitdialog', { read: ElementRef, static: true } ) submitdialog: ElementRef

    public dialogData: auth_users_add_user_dialog_result = { isCancelled: false, user: { name: '', email: '', password: '', roles: [], settings: [] }, available_roles: of( [] ) }

    constructor( @Inject( MAT_DIALOG_DATA ) public available_roles: Observable<AclRoleModel[]> ) {
        this.dialogData.available_roles = available_roles
    }

    /**
     * Update user roles list when role selection changes
     * 
     * @param selection 
     */
    onRoleSelection( selection: MatSelectionListChange ) {
        if ( selection.option.selected ) {
            this.dialogData.user.roles.push( selection.option.value )
        } else {
            let index = this.dialogData.user.roles.findIndex( ( user_role ) => user_role == selection.option.value )
            if ( index != -1 ) this.dialogData.user.roles.splice( index, 1 )
        }
    }
    /**
     * 
     * @param cancelled 
     */
    oncloseDialog( cancelled: boolean ) {
        this.dialogData.isCancelled = cancelled
    }

    /**
     * Validate dialog when user press "enter"
     */
    onInputEnter() {
        this.submitdialog.nativeElement.click()
    }
}