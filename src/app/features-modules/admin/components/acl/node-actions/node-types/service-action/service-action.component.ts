import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-acl-service-action',
  templateUrl: './service-action.component.html',
  styleUrls: ['./service-action.component.scss']
})
export class ServiceActionComponent implements OnInit {
  @Output('removeService') removeService: EventEmitter<null> = new EventEmitter<null>()
  constructor() { }

  ngOnInit() {
  }
  onRemoveService(event: MouseEvent) {
    this.removeService.emit()
  }

}
