import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './init-service-error.component.html',
  styleUrls: ['./init-service-error.component.scss']
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
