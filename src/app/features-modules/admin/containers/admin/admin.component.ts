import { Component, OnInit } from '@angular/core';
import { AdminAclSandboxService } from 'src/app/shared/sandboxes/containers/admin.acl.sandbox.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private sandbox: AdminAclSandboxService) { }

  ngOnInit() {
    this.sandbox.init()
  }

}
