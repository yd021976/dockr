import { Component, HostBinding, OnDestroy, OnInit, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { BackendConnectionState } from '../../../models/backend.connection.state.model';
import { ErrorDialogComponent } from '../../../components/error/dialog/error-dialog.component';
import { LayoutContainerSandboxService } from '../sandboxes/layout.container.sandbox.service';
import { ThemeItem } from '../../../models/theme-items.model';
import { LayoutContainerSandboxProviderToken } from '../sandboxes/layout.container.sandbox.token';

@Component( {
    selector: 'app-layout',
    templateUrl: './layout.container.html',
    styleUrls: [ './layout.container.scss' ]
} )


export class LayoutContainer implements OnInit, OnDestroy {
    themes: ThemeItem[] = [ { name: 'Default', class_name: 'default' }, { name: 'Grey/Orange', class_name: 'app-theme-2' } ];

    // @HostBinding('@.disabled')
    @HostBinding( 'class' ) componentCssClass; // Binding for theme change
    private dialogConnection: MatDialogRef<ErrorDialogComponent>;

    constructor(
        @Inject( LayoutContainerSandboxProviderToken ) public layoutSandbox: LayoutContainerSandboxService,
        public router: Router,
        private dialogService: MatDialog ) {

        this.layoutSandbox.ApiServiceConnectionState$.subscribe( ( connectionState ) => {
            this.onApiServiceConnection_change( connectionState )
        } );
    }

    ngOnInit() {
    }

    ngOnDestroy() { }

    /** Theme selection change */
    themeChange( event ) {
        this.componentCssClass = event;
    }

    onLogin() {
        this.layoutSandbox.navigateLogin();
    }
    onLogout() {
        this.layoutSandbox.navigateLogout();
    }

    onApiServiceConnection_change( connectionStatus: BackendConnectionState ) {
        switch ( connectionStatus.isConnected ) {
            // When connection is established, close modal if opened
            case true:
                if ( this.dialogConnection ) {
                    this.dialogConnection.close();
                    this.dialogConnection = null;
                }
                break;

            // If no connection, open dialog if not already opened
            case false:
                if ( !this.dialogConnection ) {
                    this.dialogConnection = this.dialogService.open( ErrorDialogComponent, { disableClose: true, data: { connectionAttemptCount: connectionStatus.attemptNumber } } );
                } else {
                    // If dialog already opened, then update connection attempt number
                    this.dialogConnection.componentInstance.connectionAttemptCount = connectionStatus.attemptNumber;
                }
                break;

            // No default case because boolean can only take 2 values that are already handled by 2 previous "case" statements
            // This line is here only to respect coding rules
            default:
                break;
        }
    }
}