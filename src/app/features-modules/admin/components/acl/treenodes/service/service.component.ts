import { Component, OnInit, Input } from '@angular/core';
import { AclTreeNode } from 'src/app/shared/models/acl/treenode.model';

@Component({
  selector: 'app-admin-acl-tree-node-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  @Input()
  get node(): AclTreeNode { return this._node }
  set node(node: AclTreeNode) { this._node = node }
  public _node: AclTreeNode

  constructor() { }

  ngOnInit() {
  }

}
