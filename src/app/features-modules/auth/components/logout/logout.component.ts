import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-logout-component',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  @Input() isLoggedOut: boolean = false
  @Output() logout: EventEmitter<void> = new EventEmitter<void>()

  constructor() { }

  ngOnInit() {
  }
  onLogout() {
    this.logout.emit(null)
  }

}
