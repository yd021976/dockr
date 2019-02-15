import { Component, OnInit, Input } from '@angular/core';
import { AclFlatTreeNode } from 'src/app/features-modules/admin/services/acl-flat-tree-node.model';

@Component({
  selector: 'app-admin-acl-tree-node-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  @Input('node') node: AclFlatTreeNode
  constructor() { }

  ngOnInit() {
  }

}
