import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AclServiceModel } from 'src/app/shared/models/acl.services.model';

@Component({
  selector: 'app-admin-acl-role-action',
  templateUrl: './role-action.component.html',
  styleUrls: ['./role-action.component.scss']
})
export class RoleActionComponent implements OnInit {
  @Input('disabled') disabled:boolean

  @Output('addService') addService: EventEmitter<null> = new EventEmitter<null>()
  @Output('removeRole') removeRole: EventEmitter<null> = new EventEmitter<null>()

  constructor() { }

  ngOnInit() {
  }

  onAddService() {
    this.addService.emit()
  }
  onRemoveRole() {
    this.removeRole.emit()
  }

}
