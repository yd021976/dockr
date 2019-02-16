import { Component, OnInit, Input } from '@angular/core';
import { AclFlatTreeNode } from 'src/app/features-modules/admin/services/acl-flat-tree-node.model';
import { CrudOperationModel } from 'src/app/shared/models/backend-services.model';

@Component({
  selector: 'app-admin-acl-tree-node-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  @Input('')
  get node(): AclFlatTreeNode { return this._node }
  set node(node: AclFlatTreeNode) {
    this._node = node
    this.crud_operation = node.data as CrudOperationModel
  }

  public _node: AclFlatTreeNode
  public crud_operation: CrudOperationModel
  constructor() { }

  ngOnInit() {
  }

}
