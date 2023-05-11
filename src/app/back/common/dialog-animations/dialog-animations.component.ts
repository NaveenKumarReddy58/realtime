import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DriverService } from 'src/app/_service/driver.service';
export interface DialogData {
  title: string;
  message: string;
  pageName: string;
  assignedOrdersCount: string;
  driverData: any;

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
  driver$: any;
  dataList:any=[];
  driverId:any;
  orderData:any;
  ngOnInit(): void {
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialogRef: MatDialogRef<DialogAnimationsComponent>, private driverService: DriverService) {}
  onConfirm(): void {
    if(this.data.pageName == 'order-details'){
      this.dialogRef.close(
        {
          res: true,
          driverId: this.driverId
        }
      );
    } else{
      this.dialogRef.close(true);
    }
  }

  onDismiss(): void {
      this.dialogRef.close(false);
  }
}
