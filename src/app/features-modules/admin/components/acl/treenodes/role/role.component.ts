import { Component, OnInit, Input } from '@angular/core';
import { AclTreeNode } from 'src/app/shared/models/acl/treenode.model';

@Component({
  selector: 'app-admin-acl-tree-node-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  @Input()
  get node(): AclTreeNode { return this._node }
  set node(node: AclTreeNode) { this._node = node }
  public _node: AclTreeNode

  constructor() { }

  ngOnInit() {
  }

}
