import { Component, OnInit, HostBinding, Input } from '@angular/core';
import {
  animate,
  animateChild,
  AnimationEvent,
  query,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import 'web-animations-js'; // WARNING: Needed in safari for web animations to work


@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.scss'],
  animations: [
    trigger('fadeAnimation', [

      transition('* => *', [
        // query('app-admin app-outlet @fadeAnimation', [animateChild()], { optional: true }),

        query(':enter',
          [
            style({ opacity: 0 })
          ],
          { optional: true }
        ),
        query(':leave',
          [
            style({ opacity: 1 }),
            animate('200ms', style({ opacity: 0 }))
          ],
          { optional: true }
        ),
        query(':enter',
          [
            style({ opacity: 0 }),
            animate('200ms', style({ opacity: 1 }))
          ],
          { optional: true }
        ),
        // ANGULAR_PATCH: workaround to animate child router outlet, @see https://github.com/angular/angular/issues/15477
        query(':leave app-outlet router-outlet ~ *',
          [
            style({ opacity: 1 }),
            animate(200, style({ opacity: 0 }))
          ],
          { optional: true })
      ])
    ])
  ]
})
export class OutletComponent implements OnInit {
  @Input() class: string = "";
  constructor() { }

  ngOnInit() {
  }

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute.component.name : '';
  }
}
