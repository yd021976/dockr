import { Component, OnInit } from '@angular/core';
import { AdminAclSandboxService } from 'src/app/shared/sandboxes/containers/admin.acl.sandbox.service';
import { RoleModel } from 'src/app/shared/models/acl/roles.model';
import { NodeTypes, NODE_TYPES, AclTreeNode } from '../../../../shared/models/acl/treenode.model';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material';

@Component({
  selector: 'app-acl-container',
  templateUrl: './acl.container.html',
  styleUrls: ['./acl.container.scss']
})
export class AclContainer implements OnInit {
  public treecontroller:NestedTreeControl<AclTreeNode>
  public datasource:MatTreeNestedDataSource<AclTreeNode>
  public node_types = NODE_TYPES


  constructor(public sandbox: AdminAclSandboxService) { 
    this.treecontroller = new NestedTreeControl<AclTreeNode>(node => this.sandbox.getTreeNodeChildren(node))
    this.datasource = new MatTreeNestedDataSource<AclTreeNode>()
  }

  /**
   * 
   */
  ngOnInit() {
    this.sandbox.init()
  }
  onFieldAllowChanged(node: AclTreeNode) {
    // this.sandbox.updateField(node)
  }
}
