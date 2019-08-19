import { Component, OnDestroy } from '@angular/core'
import { AppSandboxService } from '../sandboxes/app-sandbox.service';
import { MatSnackBarRef, MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../shared/components/snackbar/snack-bar.component';
import { Observable, Subscription } from 'rxjs';
import { ApplicationNotification } from '../../shared/models/application.notifications.model';


@Component( {
  selector: 'app-root-container',
  templateUrl: './app.container.html',
  styleUrls: [ './app.container.scss' ]
} )
export class AppContainer implements OnDestroy {
  private snackbarRef: MatSnackBarRef<SnackBarComponent> = null
  private notifications: Observable<ApplicationNotification[]>
  private error_subscribtion: Subscription

  title = 'dockr';

  /**
   * 
   * @param sandbox 
   */
  constructor( public sandbox: AppSandboxService, private snackbar: MatSnackBar ) {
    this.notifications = this.sandbox.getNotifications$()
    this.error_subscribtion = this.notifications.subscribe( (notifications:ApplicationNotification[]) => {
      if ( !notifications.length ) return

      if ( this.snackbarRef ) {
        this.snackbarRef.instance.notifications = notifications
      }
      else {
        this.snackbarRef = this.snackbar.openFromComponent( SnackBarComponent, { data: notifications, verticalPosition: 'top', duration: 5000 } )
        this.snackbarRef.afterDismissed().subscribe( () => { this.snackbarRef = null } )
      }
    } )
  }

  /**
   * 
   */
  ngOnInit() {

  }
  ngOnDestroy() {
    if ( this.error_subscribtion ) this.error_subscribtion.unsubscribe()
  }
}
