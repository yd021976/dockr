import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { AclTreeNode } from 'src/app/shared/models/acl/treenode.model';
import { ALLOWED_STATES } from 'src/app/shared/models/acl/crud-operations.model';

@Component({
  selector: 'app-admin-acl-tree-node-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  @Input()
  get node(): AclTreeNode { return this._node }
  set node(node: AclTreeNode) { this._node = node }

  @Output() fieldCheckChange: EventEmitter<AclTreeNode> = new EventEmitter<AclTreeNode>()
  allowed_states = ALLOWED_STATES
  public _node: AclTreeNode
  
  
  constructor() { }

  ngOnInit() {
  }
  public onCheckedChange(event: MatCheckboxChange) {
    this._node.checked = event.checked == true ? ALLOWED_STATES.ALLOWED : ALLOWED_STATES.FORBIDDEN
    this.fieldCheckChange.emit(this._node)
  }
  onClick(event: MouseEvent) {
    event.stopPropagation() // avoid click event propagate to parent div that select/deselect node
  }
}
