import { Component, OnInit } from '@angular/core';
import { SettingsSandboxService } from '../../../../shared/sandboxes/containers/settings-sandbox.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(public sandbox: SettingsSandboxService) { }

  ngOnInit() {
  }

}
