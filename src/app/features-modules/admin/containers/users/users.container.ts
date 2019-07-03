import { Component, OnInit } from '@angular/core';
import { AdminUsersSandboxService } from 'src/app/shared/sandboxes/containers/admin.users.sandbox.service';

@Component( {
  selector: 'app-users-container',
  templateUrl: './users.container.html',
  styleUrls: [ './users.container.scss' ]
} )
export class UsersContainer implements OnInit {

  constructor( public sandbox: AdminUsersSandboxService ) { }

  ngOnInit() {
    this.sandbox.init()
  }

}
