import { Component, HostBinding, OnDestroy, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

import { BackendServiceConnectionState } from '../../models/backend-service-connection-state.model';
import { ErrorDialogComponent } from '../../components/error/dialog/error-dialog.component';
import { LayoutContainerSandboxService } from '../../sandboxes/containers/layout-container-sandbox.service';
import { ThemeItem } from '../../models/theme-items.model';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.container.html',
    styleUrls: ['./layout.container.scss']
})


export class LayoutContainer implements OnInit, OnDestroy {
    themes: ThemeItem[] = [{ name: 'Default', class_name: 'default' }, { name: 'Grey/Orange', class_name: 'app-theme-2' }];

    // @HostBinding('@.disabled')
    @HostBinding('class') componentCssClass; // Binding for theme change
    private dialogConnection: MatDialogRef<ErrorDialogComponent>;

    constructor(
        public layoutSandbox: LayoutContainerSandboxService,
        public router: Router,
        private dialogService: MatDialog) {

        this.layoutSandbox.ApiServiceConnectionState$.subscribe((connectionState) => {
            this.onApiServiceConnection_change(connectionState);
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() { }

    /** Theme selection change */
    themeChange(event) {
        this.componentCssClass = event;
    }

    onLogin() {
        this.layoutSandbox.navigateLogin();
    }
    onLogout() {
        this.layoutSandbox.navigateLogout();
    }

    onApiServiceConnection_change(connectionStatus: BackendServiceConnectionState) {
        switch (connectionStatus.isConnected) {
            // When connection is established, close modal if opened
            case true:
                if (this.dialogConnection) {
                    this.dialogConnection.close();
                    this.dialogConnection = null;
                }
                break;

            // If no connection, open dialog if not already opened
            case false:
                if (!this.dialogConnection) {
                    this.dialogConnection = this.dialogService.open(ErrorDialogComponent, { disableClose: true, data: { connectionAttemptCount: connectionStatus.attemptNumber } });
                } else {
                    // If dialog already opened, then update connection attempt number
                    this.dialogConnection.componentInstance.connectionAttemptCount = connectionStatus.attemptNumber;
                }
                break;

            // No default case because of boolean con only take 2 value. This line is here only to respect coding rules
            default:
                break;
        }
    }
}