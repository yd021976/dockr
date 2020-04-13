import { Component, OnDestroy } from '@angular/core'
import { AppSandboxService } from '../sandboxes/app-sandbox.service';
import { MatSnackBarRef, MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../shared/components/snackbar/snack-bar.component';
import { Subscription } from 'rxjs';
import { ApplicationNotification } from '../../shared/models/application.notifications.model';


@Component({
  selector: 'app-root-container',
  templateUrl: './app.container.html',
  styleUrls: ['./app.container.scss']
})
export class AppContainer implements OnDestroy {
  private snackbarRef: MatSnackBarRef<SnackBarComponent> = null
  private subscribes: Subscription[] = []
  private current_user_login_state: boolean /** true:is logged in, false: is logged out */

  public title = 'dockr';

  /**
   * 
   * @param sandbox 
   */
  constructor(public sandbox: AppSandboxService, private snackbar: MatSnackBar) {

  }

  /**
   * 
   */
  ngOnInit() {
    this.subscribe_app_notifications() /** subscribe to app notifications */
    this.subscribe_user_auth() /** subscribe to app notifications */
  }

  /**
   * 
   */
  ngOnDestroy() {
    /** unsubscribe any observable */
    this.subscribes.forEach((subscription) => {
      subscription.unsubscribe()
    })
  }


  /**
   * Display a notification in the UI snackbar
   *  
   * @param notifications App notifications array
   */
  protected show_notification(notifications: ApplicationNotification[]) {
    if (!notifications.length) return

    if (this.snackbarRef) {
      this.snackbarRef.instance.notifications = notifications
    }
    else {
      this.snackbarRef = this.snackbar.openFromComponent(SnackBarComponent, { data: notifications, verticalPosition: 'top', duration: 5000 })
      this.snackbarRef.afterDismissed().subscribe(() => { this.snackbarRef = null })
    }
  }

  protected subscribe_app_notifications() {
    this.subscribes['notifications'] = this.sandbox.getNotifications$().subscribe((notifications: ApplicationNotification[]) => {
      this.show_notification(notifications)
    })
  }
  protected subscribe_user_auth() {
    this.subscribes['user_auth'] = this.sandbox._isLoggedin$.subscribe((isAuth: boolean) => {
      this.handle_user_logout(isAuth)
    })
  }

  protected handle_user_logout(isAuth: boolean) {

    /** User has logged in */
    if (this.current_user_login_state == false && isAuth != false) {
      //TODO: do something
      const a = 0
    }

    /** user has logged out */
    if (this.current_user_login_state == true && isAuth != true) {
      //TODO: do something
      const a = 0
    }

    this.current_user_login_state = isAuth

  }
}
