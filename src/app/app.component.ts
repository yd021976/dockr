import { Component } from '@angular/core'
import { AppSandboxService } from './shared/sandboxes/app/app-sandbox.service';
import { MatSnackBarRef, MatSnackBar } from '@angular/material';
import { SnackBarComponent } from './shared/components/snackbar/snack-bar.component';
import { Observable, Subscription } from 'rxjs';


@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
} )
export class AppComponent {
  private snackbarRef: MatSnackBarRef<SnackBarComponent> = null
  private errors$: Observable<string[]>
  private error_subscribtion: Subscription

  title = 'dockr';

  /**
   * 
   * @param sandbox 
   */
  constructor( public sandbox: AppSandboxService, private snackbar: MatSnackBar ) {
    this.errors$ = this.sandbox.getErrors$()
    this.error_subscribtion = this.errors$.subscribe( errors => {
      if ( !errors.length ) return

      if ( this.snackbarRef ) {
        this.snackbarRef.instance.errors = errors
      }
      else {
        this.snackbarRef = this.snackbar.openFromComponent( SnackBarComponent, { data: errors, verticalPosition: 'top', duration: 5000 } )
        this.snackbarRef.afterDismissed().subscribe( () => { this.snackbarRef = null } )
      }
    } )
  }

  /**
   * 
   */
  ngOnInit() {

  }
}
