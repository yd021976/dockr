import { BaseTreeControl } from '@angular/cdk/tree';
import { Component, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatTreeFlatDataSource } from '@angular/material/tree';
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
import { AclComponent } from '../../components/acl/acl.component';

@Component( {
  selector: 'app-acl-container',
  templateUrl: './acl.container.html',
  styleUrls: [ './acl.container.scss' ]
} )
export class AclContainer implements OnInit {
  @ViewChild( 'AclTree', { static: true } ) treeComponent: AclComponent

  public treecontroller: BaseTreeControl<FlatTreeNode>
  public datasource: MatTreeFlatDataSource<AclTreeNode, FlatTreeNode>
  public colModel: AclTreeColmodel[]
  public node_types = NODE_TYPES
  public selectedNode$: Observable<FlatTreeNode>
  public availableRoleService$: Observable<any>
  public aclLocked$: Observable<boolean>
  public isLoggedIn$: Observable<boolean>

  private dialog_AddRole: MatDialogRef<AddRoleDialogComponent>
  private dialog_AddService: MatDialogRef<AddServiceDialogComponent>
  private dialogService: MatDialog

  constructor( public sandbox: AdminAclSandboxService, public treeService: TreeNodesService, dialogService: MatDialog ) {
    this.dialogService = dialogService
    this.colModel = this.setColmodel()
    this.aclLocked$ = this.sandbox.isAclLocked$
    this.isLoggedIn$ = this.sandbox.isLoggedin$

    this.treeService.getChildren = ( node: AclTreeNode ) => {
      return this.sandbox.getTreeNodeChildren$( node )
    }

    this.treeService.isExpandable = ( node: AclTreeNode ) => {
      // Role node is always expandable has we can't lately update tree node expandable status to show expand button
      if ( node.type == NODE_TYPES.ROLE ) return true

      // In all other cases, return the node children
      return this.sandbox.nodeHasChildren( node )
    }
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

  add_role( node: FlatTreeNode ) {
    if ( !this.dialog_AddRole ) {
      this.dialog_AddRole = this.dialogService.open( AddRoleDialogComponent, { disableClose: true } )
      this.dialog_AddRole.afterClosed().subscribe( ( data: dialogResult ) => {
        if ( !data.cancelled && data.result != '' ) {
          this.sandbox.roles_add_entity( data.result )
        }
        this.dialog_AddRole = null // dialog is closed, clear dialog ref object
      } )
    }
  }
  remove_role( node: FlatTreeNode ) {
    this.sandbox.treenodes_update_select_node( null ) // deselect any node
    this.sandbox.roles_remove_entity( node.data[ 'uid' ] )
  }


  add_service( node: FlatTreeNode ) {
    if ( !this.dialog_AddService ) {
      this.dialog_AddService = this.dialogService.open( AddServiceDialogComponent, {
        data: this.sandbox.availableServices$,
        disableClose: true
      } )
      this.dialog_AddService.afterClosed().subscribe( ( data: AddServiceDialogComponent_dialogResult ) => {
        if ( !data.cancelled && data.result != null ) {

          this.sandbox.role_add_service( node.data.uid, JSON.parse( JSON.stringify( data.result ) ) ) // Ensure we create a new instance of the service model
          this.treeComponent.node_ExpandNode( node )
        }
        this.dialog_AddService = null
      } )
    }
  }
  remove_service( node: FlatTreeNode ) {
    this.sandbox.services_remove_entity( node )
  }

  onFieldCheckChange( node: AclTreeNode ) {
    this.sandbox.field_update_allowed_property( node )
  }
  onActionCheckChange( node: AclTreeNode ) {
    this.sandbox.action_update_allowed_property( node )
  }
  onNodeSelected( node: FlatTreeNode ) {
    // update state with selected node
    this.sandbox.treenodes_update_select_node( node )
  }


  /**
   * Lock screen to edit data
   */
  lock() {
    this.sandbox.lockResource()
  }

  /**
   * Unlock screen
   */
  unlock() {
    this.sandbox.releaseResource()
  }
}
