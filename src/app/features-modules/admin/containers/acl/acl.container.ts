import { BaseTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeFlatDataSource } from '@angular/material';
import { OnInit } from '@angular/core';

import { AclTreeNode } from '../../../../shared/models/acl/treenode.model';
import { AdminAclSandboxService } from 'src/app/shared/sandboxes/containers/admin.acl.sandbox.service';
import { FlatTreeNode } from '../../services/treeNodes.service';
import { NODE_TYPES } from '../../../../shared/models/acl/treenode.model';
import { TreeNodesService } from '../../services/treeNodes.service';
import { AclTreeColmodel } from 'src/app/shared/models/acl/acl-tree-colmodel.model';

@Component({
  selector: 'app-acl-container',
  templateUrl: './acl.container.html',
  styleUrls: ['./acl.container.scss']
})
export class AclContainer implements OnInit {
  public treecontroller: BaseTreeControl<FlatTreeNode>
  public datasource: MatTreeFlatDataSource<AclTreeNode, FlatTreeNode>
  public colModel: AclTreeColmodel[]
  public node_types = NODE_TYPES
  public selectedNode: FlatTreeNode = null

  constructor(public sandbox: AdminAclSandboxService, public treeService: TreeNodesService) {
    this.colModel = this.setColmodel()

    this.treeService.getChildren = (node: AclTreeNode) => { return this.sandbox.getTreeNodeChildren(node) }
    this.treeService.isExpandable = (node: AclTreeNode) => { return this.sandbox.nodeHasChildren(node) }
    this.treeService.nodeEqualityKey = "uid"
    this.treeService.dataSource$ = this.sandbox.acltreenodes$

    this.treecontroller = this.treeService.treeControl
    this.datasource = this.treeService.treeFlatDataSource
  }

  private setColmodel(): AclTreeColmodel[] {
    return [
      {
        colName: 'Role',
        size: '100px'
      },
      {
        colName: 'Service',
        size: '250px'
      },
      {
        colName: 'Action',
        size: '150px'
      },
      {
        colName: 'Fields',
        size: '300px'
      }
    ]
  }
  /**
   * 
   */
  ngOnInit() {
    this.sandbox.init()
  }

  remove_role(node: FlatTreeNode) { }

  remove_service(node: FlatTreeNode) { }

  add_service(node: FlatTreeNode) {
    this.sandbox.addServiceToRole(node.data.uid)
  }

  onFieldCheckChange(node: AclTreeNode) {
    this.sandbox.updateFieldNode(node)
  }
  onActionCheckChange(node:AclTreeNode){
    this.sandbox.updateActionChecked(node)
  }
  onNodeSelected(node: FlatTreeNode) {
    this.selectedNode = node
  }
}
