import { Component, OnInit } from '@angular/core';
import { AdminAclSandboxService } from 'src/app/shared/sandboxes/containers/admin.acl.sandbox.service';
import { Observable } from 'rxjs';
import { RolesNormalized, RoleModel } from 'src/app/shared/models/roles.model';

@Component({
  selector: 'app-acl-container',
  templateUrl: './acl.container.html',
  styleUrls: ['./acl.container.scss']
})
export class AclContainer implements OnInit {
  public roles: RoleModel[] = new Array()

  constructor(public sandbox: AdminAclSandboxService) { }

  ngOnInit() {
    this.sandbox.init()
  }

}
