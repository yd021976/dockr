import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})

export class ErrorDialogComponent implements OnInit {
  @Input() connectionAttemptCount: number;

  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { connectionAttemptCount: number }) {
    this.connectionAttemptCount = data.connectionAttemptCount;
  }

  ngOnInit() { }

}
