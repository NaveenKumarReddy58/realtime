import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';
import { DriverService } from 'src/app/_service/driver.service';
import { OrderService } from 'src/app/_service/order.service';
export interface DialogData {
  title: string;
  message: string;
  pageName: string;
  btns: any;
  assignedOrdersCount: string;
  driverData: any;
  orderListingData:any;
  image:any;
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
  lengthOfOrders!: number[];
  selectedPriorityNumber: number=1;
  loading: boolean= false;
  croppedImage: any;
  ngOnInit(): void {
    if(this.data.pageName == 'order-listing'){
      this.lengthOfOrders = [...Array(this.data.orderListingData.totalOrders).keys()]
    }
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,public orderService: OrderService,
  public dialogRef: MatDialogRef<DialogAnimationsComponent>, private toastr: ToastrService, private authService: AuthService) {}
  onConfirm(): void {
    if(this.data.pageName == 'order-details'){
      this.dialogRef.close(
        {
          res: true,
          driverId: this.driverId
        }
      );
    } else if(this.data.pageName == 'order-listing'){
      this.updatePriority();
      this.dialogRef.close(true)
    } else if(this.data.pageName == 'crop-image'){
      this.dialogRef.close(
        {
          res: true,
          croppedImage: this.croppedImage
        }
      );
    } else{
      this.dialogRef.close(true);
    }
  }

  setImage(event:any){
    console.log(event)
    this.croppedImage= event;
  }
  onDismiss(): void {
      this.dialogRef.close(false);
  }
  selectNumber(val:number){
    this.selectedPriorityNumber= val;
  }

  onChangeDriver(id:any){
    this.driverId= id;
  }

  updatePriority(){
    this.loading = true;
    // console.log('Api Data Err ffff', this.f, this.frmValues);

    var formdata = new FormData();
    formdata.append('order_id', this.data.orderListingData.order_id);
    formdata.append('priority', this.selectedPriorityNumber.toString());

    this.orderService.orderPriority(formdata).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.loading = false;
          return;
        }
        this.toastr.success(data?.result);
        this.loading = false;
      },
      (error) => {
        this.authService.dataError(error);
        this.loading = false;
      }
    );
  }
}
