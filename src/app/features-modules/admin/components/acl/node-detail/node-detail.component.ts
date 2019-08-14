import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FlatTreeNode } from '../../../services/treeNodes.service';
import { NODE_TYPES } from '../../../../../shared/models/treenode.model';

@Component({
  selector: 'app-acl-node-detail',
  templateUrl: './node-detail.component.html',
  styleUrls: ['./node-detail.component.scss']
})
export class NodeDetailComponent implements OnInit {
  @Input('node') node: FlatTreeNode
  @Output('addRole') addRole: EventEmitter<FlatTreeNode> = new EventEmitter<FlatTreeNode>()
  @Output('addService') addService: EventEmitter<FlatTreeNode> = new EventEmitter<FlatTreeNode>()
  @Output('removeService') removeService: EventEmitter<FlatTreeNode> = new EventEmitter<FlatTreeNode>()
  @Output('removeRole') removeRole: EventEmitter<FlatTreeNode> = new EventEmitter<FlatTreeNode>()

  public node_types = NODE_TYPES


  constructor() { }

  ngOnInit() {
  }

  add_role(node: FlatTreeNode) {
    this.addRole.emit(node)
  }
  add_service(node: FlatTreeNode) {
    this.addService.emit(node)
  }
  remove_role(node: FlatTreeNode) {
    this.removeRole.emit(node)
  }
  remove_service(node: FlatTreeNode) {
    this.removeService.emit(node)
  }

}
