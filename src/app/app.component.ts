import {
  Component,
  OnInit
} from '@angular/core';

import { AppSandboxService } from './shared/sandboxes/app/app-sandbox.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dockr';

  constructor(public sandbox: AppSandboxService) {
  }
  ngOnInit() {
  }
}
