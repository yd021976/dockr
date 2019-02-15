import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-admin-acl-tree-node-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  @Input('node') node: any

  constructor() { }

  ngOnInit() {
  }

}
