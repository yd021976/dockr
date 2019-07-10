import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-acl-default-action',
  templateUrl: './default-action.component.html',
  styleUrls: ['./default-action.component.scss']
})
export class DefaultActionComponent implements OnInit {
  @Output('addRole') addRole: EventEmitter<null> = new EventEmitter<null>()
  constructor() { }

  ngOnInit() {
  }
  onAddRole() {
    this.addRole.emit()
  }
}
