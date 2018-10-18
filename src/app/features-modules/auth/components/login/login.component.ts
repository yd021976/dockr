import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { loginCredentials } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input() error: string = "";
  @Output() login: EventEmitter<loginCredentials> = new EventEmitter();
  public credentials: loginCredentials = { strategy: 'local', email: '', password: '' };
  
  constructor() { }

  ngOnInit() {
  }

  onLogin() {
    this.login.emit(this.credentials);
  }
}
