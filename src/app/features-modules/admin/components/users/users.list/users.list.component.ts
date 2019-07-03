import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModelBase } from 'src/app/shared/models/user.model';

@Component( {
  selector: 'app-admin-users-list',
  templateUrl: './users.list.component.html',
  styleUrls: [ './users.list.component.scss' ]
} )
export class UsersListComponent implements OnInit {
  @Input( 'users' ) users$: Observable<UserModelBase[]>
  
  constructor() { }

  ngOnInit() {
  }

}
