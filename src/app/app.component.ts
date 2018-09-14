import {
  Component,
  OnInit
} from '@angular/core';

import { SandboxAppService } from './shared/sandboxes/app/sandbox-app.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dockr';

  constructor(public sandbox: SandboxAppService) { }
  ngOnInit() {
  }
}
