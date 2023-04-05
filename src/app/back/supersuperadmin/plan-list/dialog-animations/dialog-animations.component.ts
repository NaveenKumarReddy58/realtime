import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-animations',
  templateUrl: './dialog-animations.component.html',
  styleUrls: ['./dialog-animations.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class DialogAnimationsComponent {
  constructor(public dialogRef: MatDialogRef<DialogAnimationsComponent>) {}
}
