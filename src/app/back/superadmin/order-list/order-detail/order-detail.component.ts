import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ResolveStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';
import { DriverService } from 'src/app/_service/driver.service';
import { OrderService } from 'src/app/_service/order.service';
import { DialogAnimationsComponent } from 'src/app/back/common/dialog-animations/dialog-animations.component';
import { ReusableGoogleMapComponent } from 'src/app/reusable-google-map/reusable-google-map.component';
import { SendNotificationComponent } from 'src/app/send-notification/send-notification.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
})
export class OrderDetailComponent {
  id: any;
  orderData: any;
  loading: any;
  order$!: Observable<object[]>;
  orderDetailsPushForm: FormGroup;
  isSubmitted: boolean= false;
  isSubmittedCustomer: boolean= false;
  isShowRecentNotifications: boolean= false;
  invoiceImageSrc: any = 'assets/images/edit-icon.png';
  isInvoiceLoading: boolean= false;
  unsuccessfullReasons:any=[];
  receiverImage: any = 'assets/images/edit-icon.png';

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
    this.id= undefined;
    this.id = this.route.snapshot.params['id'];
    if(this.id){
      this.orderDetail(this.id);
    }
  }
  ngOnInit(): void {

  }
  get f() {
    return this.orderDetailsPushForm.controls;
  }
  getDateTime(status: string){
    //if shipped time is not there then make enroute time as shipped time
    let obj = {
      "status": "shipped",
      "updated_at": "2023-09-30T07:12:40.614870Z",
      "updated_by": "sandeep@gmail.com",
      "status_reason": []
    };
    let shippedItem = this.orderData?.status_history.find((item:any) => item.status == 'shipped');
    if(shippedItem == undefined){
      let enRouteItem = this.orderData?.status_history.find((item:any) => item.status == 'en-route');
      if(enRouteItem){
        obj.updated_at= enRouteItem.updated_at;
        obj.updated_by= enRouteItem.updated_by;
        obj.status_reason= enRouteItem.status_reason;
        this.orderData.status_history.push(obj);
      }
    }
    //end
    var item = this.orderData?.status_history.find((item:any) => item.status === status);
    if(item){
      return item.updated_at;
    } else{
      return "NA";
    }
  }
  sendNotification(enterAnimationDuration: string,
    exitAnimationDuration: string,userId?:any, groupType?:string){
      const dialogRef = this.dialog.open(SendNotificationComponent, {
        width:"50%",
        enterAnimationDuration,
        exitAnimationDuration,
        panelClass: 'order-detail',
        data: {
          title:'Send Notification To '+groupType,
          btns: ['Close','Send'],
          isShowSelectGroupSection: false,
          groupType: groupType,
          userId: userId,
          orderId: this.orderData.id
        },
      });
      dialogRef.afterClosed().subscribe((dialogResult:any) => {
        if(dialogResult){
        }
      });
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
        if(this.orderData?.order_invoice?.length > 0){
          this.invoiceImageSrc= this.orderData.order_invoice[this.orderData.order_invoice?.length-1].invoice_doc;
          this.receiverImage= this.orderData.receiver_details[this.orderData.receiver_details?.length-1].photo;
        }
        this.orderData?.status_history?.find((elt:any)=>{
          if(elt.status == 'unsuccessful' || elt.status == 'successful' || elt.status == 'cancelled'){
            elt.status_reason.forEach((reason:any) => {
              this.unsuccessfullReasons.push(reason)
            });    
          }
        })
        this.loading = false;
      },
      (error) => {
        this.authService.dataError(error);
        this.loading = false;
      }
    );
  }
  invoice: any;
  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.invoiceImageSrc = reader.result;
      };
      this.invoice = file;
      reader.readAsDataURL(file);
    }
  }
  removeProfilePhoto(e: any) {
    e.stopPropagation();
    this.invoiceImageSrc = 'assets/images/edit-icon.png';
    this.authService.convertImageIntoBinary(this.invoiceImageSrc).subscribe((res:any) => {
      var file = new File([res], "packing_slip", { type: "image/jpeg", lastModified: Date.now() })
      this.invoice = file;
    });;
  }
  sendMessage(){
    this.isSubmitted= true;

  }
  uploadInvoice(){
    var formdata = new FormData();
      formdata.append('order', JSON.stringify(Number(this.orderData?.id)));
      if(this.invoice){
        formdata.append('invoice_doc', this.invoice);
      }
      this.isInvoiceLoading= true;
      this.orderService.uploadInvoice(formdata).subscribe((res:any)=>{
        this.isInvoiceLoading= false;
        this.toastr.success("Invoice Uploaded Successfully")
      } , (err:any)=>{
        this.isInvoiceLoading= false;
        this.toastr.error("Failed to Upload")
      })
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
          btns: ['Close','Update'],
          driverData: {
            id: this.orderData?.current_driver?.id,
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
          this.loading = false;
          if (this.authService.resultCodeError(data)) {
            return;
          }

          this.toastr.success(data?.resultDescription);
          this.orderDetail(this.id);
        },
        (error) => {
          this.authService.dataError(error);
          this.loading = false;
        }
      );
    }

    trackDriver() {

      let enterAnimationDuration = '200ms';
      let exitAnimationDuration = '200ms';
      const dialogRef = this.dialog.open(ReusableGoogleMapComponent, {
        width: '800px',
        height: '600px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: {
          height: '450px',
          isShowDirections: true,
          orderData: this.orderData
        },
  
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
  
        }
      });
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
