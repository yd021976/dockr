import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BackendServiceModel } from "src/app/shared/models/acl.services.model";
import { Observable } from "rxjs";

export type dialog_add_service_result = {
    cancelled: boolean,
    result: BackendServiceModel // User input : Service object to add
}

@Component({
    selector: 'app-admin-permissions-addservice-dialog',
    templateUrl: './add.service.dialog.component.html',
    styleUrls: ['./add.service.dialog.component.scss']
})

export class AdminPermissionsAddServiceDialogComponent {
    @ViewChild('submitdialog', { read: ElementRef, static: true }) submitdialog: ElementRef

    public dialogData: dialog_add_service_result = { cancelled: false, result: null }

    constructor(
        public dialogRef: MatDialogRef<AdminPermissionsAddServiceDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public availableServices:Observable<BackendServiceModel[]>
    ) { }

    /**
     * 
     * @param cancelled 
     */
    onClose(cancelled: boolean) {
        this.dialogData.cancelled = cancelled
    }
    /**
     * 
     */
    onInputEnter() {
        this.submitdialog.nativeElement.click()
    }
}