import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export type dialogResult = {
    cancelled: boolean,
    result: string // User input : The role name
}

@Component({
    selector: 'app-admin-acl-addrole-dialog',
    templateUrl: './add.role.dialog.component.html',
    styleUrls: ['./add.role.dialog.component.scss']
})

export class AddRoleDialogComponent {
    @ViewChild('submitdialog', { read: ElementRef }) submitdialog: ElementRef

    public dialogData: dialogResult = { cancelled: false, result: '' }

    constructor(
        public dialogRef: MatDialogRef<AddRoleDialogComponent>,
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