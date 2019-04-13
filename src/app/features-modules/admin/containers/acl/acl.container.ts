import { BaseTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeFlatDataSource, MatDialogRef, MatDialog } from '@angular/material';
import { OnInit } from '@angular/core';

import { AclTreeNode } from '../../../../shared/models/acl/treenode.model';
import { AdminAclSandboxService } from 'src/app/shared/sandboxes/containers/admin.acl.sandbox.service';
import { FlatTreeNode } from '../../services/treeNodes.service';
import { NODE_TYPES } from '../../../../shared/models/acl/treenode.model';
import { TreeNodesService } from '../../services/treeNodes.service';
import { AclTreeColmodel } from 'src/app/shared/models/acl/acl-tree-colmodel.model';
import { Observable } from 'rxjs';
import { BackendServiceModel } from 'src/app/shared/models/acl/backend-services.model';
import { AddRoleDialogComponent, dialogResult } from '../../components/acl/dialogs/add.role/add.role.dialog.component';
import { AddServiceDialogComponent, AddServiceDialogComponent_dialogResult } from '../../components/acl/dialogs/add.service/add.service.dialog.component';

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
  public selectedNode$: Observable<FlatTreeNode>
  public availableRoleService$: Observable<any>

  private dialog_AddRole: MatDialogRef<AddRoleDialogComponent>
  private dialog_AddService: MatDialogRef<AddServiceDialogComponent>
  private dialogService: MatDialog

  constructor(public sandbox: AdminAclSandboxService, public treeService: TreeNodesService, dialogService: MatDialog) {
    this.dialogService = dialogService

    this.colModel = this.setColmodel()

    this.treeService.getChildren = (node: AclTreeNode) => { return this.sandbox.getTreeNodeChildren(node) }
    this.treeService.isExpandable = (node: AclTreeNode) => { return this.sandbox.nodeHasChildren(node) }
    this.treeService.nodeEqualityKey = "uid"
    this.treeService.dataSource$ = this.sandbox.acltreenodes$

    this.treecontroller = this.treeService.treeControl
    this.datasource = this.treeService.treeFlatDataSource

    this.selectedNode$ = this.sandbox.currentSelectedNode$
    this.availableRoleService$ = this.sandbox.availableServices$

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

  add_role(node: FlatTreeNode) {
    if (!this.dialog_AddRole) {
      this.dialog_AddRole = this.dialogService.open(AddRoleDialogComponent, { disableClose: true })
      this.dialog_AddRole.afterClosed().subscribe((data: dialogResult) => {
        if (!data.cancelled && data.result != '') {
          this.sandbox.aclAddRole(data.result)
        }
        this.dialog_AddRole = null // dialog is closed, clear dialog ref object
      })
    }
  }
  remove_role(node: FlatTreeNode) {
    this.sandbox.selectNode(null) // deselect any node
    this.sandbox.aclRemoveRole(node.data['uid'])
  }


  add_service(node: FlatTreeNode) {
    if (!this.dialog_AddService) {
      this.dialog_AddService = this.dialogService.open(AddServiceDialogComponent, {
        data: this.sandbox.availableServices$,
        disableClose: true
      })
      this.dialog_AddService.afterClosed().subscribe((data: AddServiceDialogComponent_dialogResult) => {
        if (!data.cancelled && data.result != null) {

          this.sandbox.addServiceToRole(node.data.uid, data.result)
        }
        this.dialog_AddService = null
      })
    }
  }
  remove_service(node: FlatTreeNode) { }

  onFieldCheckChange(node: AclTreeNode) {
    this.sandbox.updateFieldNode(node)
  }
  onActionCheckChange(node: AclTreeNode) {
    this.sandbox.updateActionChecked(node)
  }
  onNodeSelected(node: FlatTreeNode) {
    // update state with selected node
    this.sandbox.selectNode(node)
  }
}
