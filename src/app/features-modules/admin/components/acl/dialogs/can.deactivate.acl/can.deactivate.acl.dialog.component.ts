import { Component, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export type AddServiceDialogComponent_dialogResult = {
    cancelled: boolean,
    result: any // User input : Service object to add
}

@Component({
    selector: 'app-admin-acl-candeactivate-acl-dialog',
    templateUrl: './can.deactivate.acl.dialog.component.html',
    styleUrls: ['./can.deactivate.acl.dialog.component.scss']
})

export class CandeactivateAclDialog {
    constructor(
        public dialogRef: MatDialogRef<CandeactivateAclDialog>,
    ) { }
}