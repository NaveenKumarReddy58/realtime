import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
export interface DialogData {
  title: string;
  message: string;
}
@Component({
  selector: 'app-dialog-animations',
  templateUrl: './dialog-animations.component.html',
  styleUrls: ['./dialog-animations.component.css'],
})
export class DialogAnimationsComponent {
  dialogData!: DialogData;
    title:any;
    message:any;
  ngOnInit(): void {}
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialogRef: MatDialogRef<DialogAnimationsComponent>) {}
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
      this.dialogRef.close(false);
  }
}
