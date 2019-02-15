import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-admin-acl-tree-node-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  @Input('node') node: any
  
  constructor() { }

  ngOnInit() {
  }

}
