import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-admin-acl-tree-node-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  @Input('node') node: any
  constructor() { }

  ngOnInit() {
  }

}
