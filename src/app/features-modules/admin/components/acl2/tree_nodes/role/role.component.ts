import { Component, OnInit, Input } from '@angular/core';
import { AclFlatTreeNode } from 'src/app/features-modules/admin/services/acl-flat-tree-node.model';
import { RoleModel } from 'src/app/shared/models/roles.model';

@Component({
  selector: 'app-admin-acl-tree-node-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  @Input()
  get node(): AclFlatTreeNode { return this._node }
  set node(node: AclFlatTreeNode) {
    this._node = node
    this.role = node.data as RoleModel
  }
  public _node: AclFlatTreeNode
  public role: RoleModel

  constructor() { }

  ngOnInit() {
  }

}
