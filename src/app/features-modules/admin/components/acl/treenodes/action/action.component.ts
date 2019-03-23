import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AclTreeNode } from 'src/app/shared/models/acl/treenode.model';
import { Observable, Subscription } from 'rxjs';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'app-admin-acl-tree-node-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit, OnDestroy {
  @Input()
  get node(): AclTreeNode { return this._node }
  set node(node: AclTreeNode) { this._node = node }

  @Input('fields') fields: Observable<AclTreeNode[]>
  @Output('checkChange') checkChange: EventEmitter<AclTreeNode> = new EventEmitter<AclTreeNode>()

  public _node: AclTreeNode
  public checked: boolean = false
  public indeterminate: boolean = false
  private _subscription: Subscription = null
  static count: number = 0

  constructor() {
    ActionComponent.count = ActionComponent.count + 1
  }
  ngOnDestroy() {
    if (this._subscription) this._subscription.unsubscribe()
  }

  ngOnInit() {
    this._subscription = this.fields.subscribe((fields) => {
      this.setCheckboxState(fields)
    })
  }

  /**
   * Sets checkbox cheked status depending children "fields" node checked status
   * 
   * @param fields 
   */
  private setCheckboxState(fields: AclTreeNode[]) {
    if (fields.length == 0) {
      this.indeterminate = false
      this.checked = this.node.checked
    } else {
      this.checked = false

      var allowedFieldCount: number = 0
      var fieldCount: number = fields.length

      fields.forEach((field) => {
        if (field.checked) {
          allowedFieldCount = allowedFieldCount + 1
        }
      })
      switch (allowedFieldCount) {
        case 0:
          this.indeterminate = false
          this.checked = false
          break
        case fieldCount:
          this.indeterminate = false
          this.checked = true
          break
        default:
          this.indeterminate = true
          this.checked = false
          break
      }
    }
  }

  onClick(event: MouseEvent) {
    event.stopPropagation()
  }
  onCheckChange(event: MatCheckboxChange) {
    this._node.checked = event.checked
    this.checkChange.emit(this._node)
  }
}
