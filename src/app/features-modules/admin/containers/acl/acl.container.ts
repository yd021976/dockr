import { Component, OnInit } from '@angular/core';
import { AdminAclSandboxService } from 'src/app/shared/sandboxes/containers/admin.acl.sandbox.service';
import { RoleModel } from 'src/app/shared/models/roles.model';
import { NODE_TYPES } from '../../services/acl-flat-tree-node.model';

@Component({
  selector: 'app-acl-container',
  templateUrl: './acl.container.html',
  styleUrls: ['./acl.container.scss']
})
export class AclContainer implements OnInit {
  public roles: RoleModel[] = new Array()
  public node_types = NODE_TYPES
  
  
  constructor(public sandbox: AdminAclSandboxService) { }

  /**
   * 
   */
  ngOnInit() {
    this.sandbox.init()
  }

}
