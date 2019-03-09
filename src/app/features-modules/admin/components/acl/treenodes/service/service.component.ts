import { Component, OnInit, Input } from '@angular/core';
import { AclFlatTreeNode } from 'src/app/features-modules/admin/services/acl-flat-tree-node.model';
import { BackendServiceModel } from 'src/app/shared/models/acl/backend-services.model';

@Component({
  selector: 'app-admin-acl-tree-node-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  @Input()
  get node(): AclFlatTreeNode { return this._node }
  set node(node: AclFlatTreeNode) { this._node = node }
  public _node: AclFlatTreeNode

  constructor() { }

  ngOnInit() {
  }

}
