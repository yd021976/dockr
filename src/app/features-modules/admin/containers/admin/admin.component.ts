import { Component, OnInit, Input } from '@angular/core';
import { AdminAclSandboxService } from 'src/app/shared/sandboxes/containers/admin.acl.sandbox.service';
import { RoleModel } from 'src/app/shared/models/acl/roles.model';
import { Observable } from 'rxjs';
import { MatTreeNestedDataSource } from '@angular/material';
import { NestedTreeControl } from '@angular/cdk/tree';
import { AclTreeNode } from '../../../../shared/models/acl/treenode.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  roles: Observable<RoleModel[]>
  selectedRole: RoleModel = null

  treecontroller: NestedTreeControl<AclTreeNode>
  datasource: MatTreeNestedDataSource<AclTreeNode>

  constructor(private sandbox: AdminAclSandboxService) {
    this.treecontroller = new NestedTreeControl<AclTreeNode>(node => this.sandbox.getTreeNodeChildren(node))
    this.datasource = new MatTreeNestedDataSource<AclTreeNode>()
  }

  ngOnInit() {
    this.sandbox.init()
    this.roles = this.sandbox.roles$
    this.sandbox.acltreenodes$.subscribe((nodes) => {
      this.datasource.data = nodes
    })
  }
  addServiceToRole() {
    this.sandbox.addServiceToRole(this.selectedRole.uid)
  }
  checkedChange(node: AclTreeNode) {
    this.sandbox.updateFieldNode(node)
  }
  trackNodeChange(index, item) {
    return item.uid
  }
  hasChild = (_: number, node: AclTreeNode) => this.sandbox.nodeHasChildren(node);
}
