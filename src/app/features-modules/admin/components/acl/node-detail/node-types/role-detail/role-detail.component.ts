import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FlatTreeNode } from 'src/app/features-modules/admin/services/treeNodes.service';

@Component({
  selector: 'app-admin-acl-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss']
})
export class RoleDetailComponent implements OnInit {
  @Input('node') node: FlatTreeNode
  @Output('removeRole') removeRole: EventEmitter<FlatTreeNode> = new EventEmitter<FlatTreeNode>()
  @Output('addService') addService: EventEmitter<FlatTreeNode> = new EventEmitter<FlatTreeNode>()

  constructor() { }

  ngOnInit() {
  }

  remove_role() {
    this.removeRole.emit(this.node)
  }
  add_service() {
    this.addService.emit(this.node)
  }
}
