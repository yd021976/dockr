import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { BackendServiceModel } from "src/app/shared/models/acl/backend-services.model";
import { Observable } from "rxjs";

export type AddServiceDialogComponent_dialogResult = {
    cancelled: boolean,
    result: any // User input : Service object to add
}

@Component({
    selector: 'app-admin-acl-addservice-dialog',
    templateUrl: './add.service.dialog.component.html',
    styleUrls: ['./add.service.dialog.component.scss']
})

export class AddServiceDialogComponent {
    @ViewChild('submitdialog', { read: ElementRef }) submitdialog: ElementRef

    public dialogData: AddServiceDialogComponent_dialogResult = { cancelled: false, result: '' }

    constructor(
        public dialogRef: MatDialogRef<AddServiceDialogComponent>,
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