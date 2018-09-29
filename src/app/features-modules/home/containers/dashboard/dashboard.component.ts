import { Component, OnInit } from '@angular/core';
import { DashboardSandbox } from '../../../../shared/sandboxes/containers/dashboard-sandbox.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public sandbox: DashboardSandbox) { }

  ngOnInit() {
  }
  getTemplates() {
    this.sandbox.getTemplates().then((templates) => {
      let a = 0;
    })
      .catch((error) => {
        let a = 0;
      })
  }
  public isAuth() {
    this.sandbox.isAuth()
      .then((isAuth) => {
        let a = 0;
      })
      .catch((error) => {
        let a = 0;
      })
  }
}
