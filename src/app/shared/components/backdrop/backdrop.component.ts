import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
// import 'web-animations-js'; // WARNING: Needed in safari for web animations to work
import {
  AnimationEvent,
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  animateChild
} from '@angular/animations';
import { MatSpinner } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.scss'],
  animations: [
    // Main animation : Wait for children to animate on show/hide
    trigger('onNavigating', [
      transition(':enter', [
        query('@*', animateChild())
      ]),
      transition(':leave', [
        query('@*', animateChild())
      ])
    ]),

    // Backdrop animations (Enter/Leave)
    trigger('backdropFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in'),
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0 })),
      ])
    ]),

    // Spinner animation (Enter/Leave)
    trigger('fadeSpinner', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ],
  host: {}
})
export class BackdropComponent implements OnInit, OnDestroy {
  // show/hide the backdrop
  @Input() show: boolean = false;
  // Link this component "navigating" property with router state (show on start navigating and hide when navigating is done)
  @Input() linkRouterState: boolean = false;
  @Input() showSpinner: boolean = true;

  // Styles
  @Input() opacity: number = 0.7;
  @Input() blur: string = "3px";

  private routerSubscribe: Subscription = null;
  constructor(private router: Router) {
  }

  ngOnInit() {
    if (this.linkRouterState) {
      this.routerSubscribe = this.router.events.subscribe(event => this._onRouterEvent(event));
    }
  }
  ngOnDestroy() {
    if (this.routerSubscribe) this.routerSubscribe.unsubscribe();
  }

  private _onRouterEvent(event) {
    if (event instanceof NavigationStart) this.show = true;
    // if (event instanceof (NavigationEnd || NavigationCancel || NavigationError)) {
    //   this.show = false;
    // }
    if (event instanceof NavigationCancel || event instanceof NavigationEnd || event instanceof NavigationError) {
      this.show = false;
    }
  }

  getStyles() {
    return {
      'opacity': this.opacity,
      'filter': "blur(" + this.blur + ")"
    }
  }
}
