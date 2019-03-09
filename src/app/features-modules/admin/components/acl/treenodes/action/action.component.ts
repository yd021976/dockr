import { Component, OnInit, Input } from '@angular/core';
import { AclFlatTreeNode } from 'src/app/features-modules/admin/services/acl-flat-tree-node.model';
// import { CrudOperationModel, dataModelProperty } from 'src/app/shared/models/acl/backend-services.model';

@Component({
  selector: 'app-admin-acl-tree-node-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  @Input('')
  get node(): AclFlatTreeNode { return this._node }
  set node(node: AclFlatTreeNode) { this._node = node }

  public _node: AclFlatTreeNode
  public checked: boolean = false
  public indeterminate: boolean = false

  constructor() { }

  ngOnInit() {
    this.setCheckboxState()
  }
  private setCheckboxState() {
    // if (!this._node.expandable) {
    //   this.indeterminate = false
    //   this.checked = this.crud_operation.allowed
    // } else {
    //   this.checked = false

    //   var allowedFieldCount: number = 0
    //   var fieldCount: number = Object.keys(this.crud_operation.fields).length
    //   Object.values(this.crud_operation.fields).forEach((field: dataModelProperty) => {
    //     if (field.allowed) {
    //       allowedFieldCount = allowedFieldCount + 1
    //     }
    //   })
    //   if (allowedFieldCount == fieldCount) {
    //     this.indeterminate = false
    //     this.checked = true
    //   } else {
    //     this.indeterminate = true
    //     this.checked = false
    //   }
    // }
  }

}
