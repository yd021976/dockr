import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AclFlatTreeNode } from 'src/app/features-modules/admin/services/acl-flat-tree-node.model';
// import { dataModelProperty } from 'src/app/shared/models/acl/backend-services.model';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'app-admin-acl-tree-node-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  @Input()
  get node(): AclFlatTreeNode { return this._node }
  set node(node: AclFlatTreeNode) { this._node = node }
  @Output() allowChange: EventEmitter<AclFlatTreeNode> = new EventEmitter<AclFlatTreeNode>()

  public _node: AclFlatTreeNode
  constructor() { }

  ngOnInit() {
  }
  public allowedChange(event: MatCheckboxChange) {
    this._node.checked = event.checked
    this.allowChange.emit(this._node)
  }

}
