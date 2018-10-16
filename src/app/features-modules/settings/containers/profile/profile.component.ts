import { Component, OnInit } from '@angular/core';
import { SettingsSandboxService } from '../../../../shared/sandboxes/containers/settings-sandbox.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public sandbox: SettingsSandboxService) { 
    let a=0;
  }

  ngOnInit() {
  }

}
