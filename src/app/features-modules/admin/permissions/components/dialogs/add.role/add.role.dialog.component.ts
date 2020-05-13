import { Component, Inject, ViewChild, ElementRef, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormControl, Validators, ValidatorFn } from "@angular/forms";

export type dialogResult = {
    cancelled: boolean,
    result: string // User input : The role name
}
export type dialogData = {
    validator: () => ValidatorFn /** a validator for role_name form field */
}

@Component({
    selector: 'app-admin-permissions-addrole-dialog',
    templateUrl: './add.role.dialog.component.html',
    styleUrls: ['./add.role.dialog.component.scss']
})

export class AdminPermissionsAddRoleDialogComponent implements OnInit {
    @ViewChild('submitdialog', { read: ElementRef, static: true }) submitdialog: ElementRef

    public dialogData: dialogResult = { cancelled: false, result: '' }
    public role_name: FormControl

    constructor(
        public dialogRef: MatDialogRef<AdminPermissionsAddRoleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: dialogData
    ) {
        if (!this.data.validator) {
            throw new Error('A validator for role_name form field must be provided')
        }
    }

    ngOnInit() {
        this.role_name = new FormControl(this.dialogData.result, [
            Validators.required,
            this.data.validator()
        ])
    }
    /**
     * 
     * @param cancelled 
     */
    onClose(cancelled: boolean) {
        let canClose: boolean = false
        this.dialogData.cancelled = cancelled

        if (cancelled === false) {
            if (this.role_name.valid === true) {
                canClose = true
            }
        }

        /** close dialog if no errors or if cancelled */
        if (canClose || this.dialogData.cancelled === true) this.dialogRef.close(this.dialogData)
    }
    /**
     * 
     */
    onInputEnter() {
        this.submitdialog.nativeElement.click()
    }
}