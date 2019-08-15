import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AclRoleModel } from 'src/app/shared/models/acl.role.model';
import { UserModelBase } from 'src/app/shared/models/user.model';

@Component( {
  selector: 'app-admin-roles-list',
  templateUrl: './roles.list.component.html',
  styleUrls: [ './roles.list.component.scss' ]
} )
export class RolesListComponent implements OnInit {
  @Input( 'user' ) user$: Observable<UserModelBase>
  @Input( 'available_roles' ) available_roles$: Observable<AclRoleModel[]>

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
