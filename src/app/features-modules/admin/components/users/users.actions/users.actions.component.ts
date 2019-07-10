import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserModelBase } from 'src/app/shared/models/user.model';

@Component( {
    selector: 'app-admin-users-actions',
    templateUrl: './users.actions.component.html',
    styleUrls: [ './users.actions.component.scss' ]
} )
export class UsersActionsComponent implements OnInit {
    @Input( 'user' ) user: UserModelBase
    @Input( 'direction' ) direction: string = 'row' // Shoudl be "row" or "column"
    @Output( 'add_user' ) add_user: EventEmitter<null> = new EventEmitter<null>()
    @Output( 'remove_user' ) remove_user: EventEmitter<UserModelBase> = new EventEmitter<UserModelBase>()

    constructor() { }
    ngOnInit() { }
    onAddUser() {
        this.add_user.emit()
    }
    onRemoveUser() {
        this.remove_user.emit( this.user )
    }
}