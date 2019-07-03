import { Component, OnInit, Input } from '@angular/core';
import { UserModelBase } from 'src/app/shared/models/user.model';
import { Observable } from 'rxjs';

@Component( {
  selector: 'app-admin-user-details',
  templateUrl: './user.details.component.html',
  styleUrls: [ './user.details.component.scss' ]
} )
export class UserDetailsComponent implements OnInit {
  @Input( 'user' ) user$: Observable<UserModelBase>

  /**
   * 
   */
  constructor() { }

  /**
   * 
   */
  ngOnInit() {
  }

}
