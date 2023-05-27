import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';
import { DriverService } from 'src/app/_service/driver.service';
import { OrderService } from 'src/app/_service/order.service';
import { DialogAnimationsComponent } from 'src/app/back/common/dialog-animations/dialog-animations.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
})
export class OrderDetailComponent {
  id: number;
  orderData: any;
  loading: any;
  order$!: Observable<object[]>;
  orderDetailsPushForm: FormGroup;
  isSubmitted: boolean= false;
  isSubmittedCustomer: boolean= false;
  isShowRecentNotifications: boolean= false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public orderService: OrderService,
    public driverService: DriverService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.orderDetailsPushForm = formBuilder.group({
      pnMsgDriver: ['', [Validators.required]],
      pnMsgCustomer:['',[Validators.required]]
    });
    this.id = this.route.snapshot.params['id'];
    this.orderDetail(this.id);
  }
  ngOnInit(): void {}
  get f() {
    return this.orderDetailsPushForm.controls;
  }
  orderDetail(id: number) {
    this.orderService.orderDetail(id).subscribe(
      (data: any) => {
        this.loading = false;
        if (this.authService.resultCodeError(data)) {
          this.loading = false;
          return;
        }
        this.orderData = data?.result;
        this.loading = false;
      },
      (error) => {
        this.authService.dataError(error);
        this.loading = false;
      }
    );
  }
  sendMessage(){
    this.isSubmitted= true;

  }
  sendMessageToCustomer(){
    this.isSubmittedCustomer= true;
  }


  orderDelete(id: any) {
    
    let enterAnimationDuration = '200ms';
    let exitAnimationDuration = '200ms';

    const dialogRef = this.dialog.open(DialogAnimationsComponent, {
      width: '450px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: 'Alert?',
        message:
          'Are you sure want to delete this order?',
      },
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
        this.orderService.orderDelete(id).subscribe(
          (data: any) => {
            if (this.authService.resultCodeError(data)) {
              return;
            }
    
            this.router.navigate(['/admin/dashboard']);
            this.toastr.success('Order Deleted');
          },
          (error) => {
            this.authService.dataError(error);
          }
        );
      }
    });
  }
  reassignNewDriver(enterAnimationDuration: string,
    exitAnimationDuration: string,){
      const dialogRef = this.dialog.open(DialogAnimationsComponent, {
        height: '500px',
        enterAnimationDuration,
        exitAnimationDuration,
        panelClass: 'order-detail',
        data: {
          title: 'Update?',
          pageName: 'order-details',
          driverData: {
            id: this.orderData?.assigned_order[0]?.driver.id,
            assignedOrdersCount:this.orderData?.assigned_order[0]?.driver?.assigned_orders_count,
            isShowDropdownValues: true,
            isShowAssignedCount: false
          },
          
          message:
            'Do you want to assign this order to new driver?',
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if(dialogResult){
          if(dialogResult.res){
            this.updateAssignOrder(dialogResult.driverId);
          }
        }
      });
    }

    updateAssignOrder(id:any){

      var formdata = new FormData();
      formdata.append('order_ids', JSON.stringify([Number(this.id)]));
      formdata.append('driver_id', id);

      this.orderService.orderAssign(formdata).subscribe(
        (data: any) => {
          if (this.authService.resultCodeError(data)) {
            this.loading = false;
            return;
          }

          this.toastr.success(data?.resultDescription);
          this.loading = false;
        },
        (error) => {
          this.authService.dataError(error);
          this.loading = false;
        }
      );
    }

    getRecentNotifications(){
      this.isShowRecentNotifications= true;
    }
    closeRecentNotifications(){
      this.isShowRecentNotifications= false;

    }
    copyText(val: string){
      let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
  
    }
}
