import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-admin-acl-tree-node-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  @Input('node') node: any
  constructor() { }

  ngOnInit() {
  }

}
