import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { Observable, count } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';
import { DriverService } from 'src/app/_service/driver.service';
import { OrderService } from 'src/app/_service/order.service';
import { DialogAnimationsComponent } from '../../common/dialog-animations/dialog-animations.component';
import { MatDialog } from '@angular/material/dialog';
import { SendNotificationComponent } from 'src/app/send-notification/send-notification.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent {
  addAssign!: FormGroup;
  loading = false;
  isSubmitted = false;
  orderData: any;
  delloading = false;
  toggle: any = [];
  assignArr: any = [];
  data: Select2Data = [];
  orderCountData: any ;
  id: any;
  optionstype: any = 'all';
  buttonData: any = ['Unassigned', 'Pending', 'Cancelled', 'Successful'];
  todayDate: Date = new Date();
  order$!: Observable<object[]>;
  driver$!: Observable<object[]>;
  orderCount$!: Observable<object[]>;
  _unfilteredOptions: any = [];
  _unfilteredStatus: any = [];
  options: any;
  isShowDriversFilter: boolean = false;
  isShowStatusFilter: boolean= false;
  phoneIndex: any;
  isShowContactDialog: boolean= false;
  statusOptions: any;
  isShowPushNotificationForm: boolean= false;
  imageSrc: any= "../../assets/images/photoupload.png";
  showPaginator= true;
  todayOrdersCount: any = [
    {
      "order_type": "both",
      "count": 0,
      "isActive": false
    },
    {
      "order_type": "delivery",
      "count": 0,
      "isActive": false
    },
    {
      "order_type": "pickup",
      "count": 0,
      "isActive": false
    }       
  ]
  allOrdersCount: any = [
    {
      "order_status": "all",
      "count": 0,
      "isActive": false
    },
    {
      "order_status": "pending",
      "count": 0,
      "isActive": false
    },
    {
      "order_status": "successful",
      "count": 0,
      "isActive": false
    },
    {
      "order_status": "unsuccessful",
      "count": 0,
      "isActive": false
    },
    {
      "order_status": "cancelled",
      "count": 0,
      "isActive": false
    },
    {
      "order_status": "shipped",
      "count": 0,
      "isActive": false
    },
    {
      "order_status": "en-route",
      "count": 0,
      "isActive": false
    },
  ]
  orderDate: any;
  orderType: any;
  orderStatus: any;
  selectedDateVal: any='';
  page: number=0;
  startNumber: number = 1;
  endNumber: number= 10;
  ordersListCount: number = 0;
  perPageSize: number= 10;
  isShowDeleteOrdersDialog: boolean= false;
  deleteOrderId: any;
  public isViewAllMode: boolean= false;
  driverData: any = [];
  copyOrderData: any;
  pendingOrdersCount: any;
  isShowRefreshSpin:boolean= false;
  pickupTime: any;
  delyTime: any;


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
    // this.orderList(this.orderDate, this.orderType, this.orderStatus, this.page);

    this.addAssign = formBuilder.group({
      driver_id: ['', [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addAssign.controls;
  }

  // convenience getter for easy access to form values
  get frmValues() {
    return this.addAssign.value;
  }


  ngOnInit(): void {
    this.orderCount();
    this.orderService.getSearchText().subscribe((res)=>{
      if(res && res.length > 0){
        this.orderList(this.orderDate,this.orderType, this.orderStatus, this.page,res);
      } else{
        this.orderList(this.orderDate,this.orderType, this.orderStatus, this.page)
      }
    })
  }

  getDriverList(){
    if(this.driverData.length == 0){
      this.driverList()
    }
  }
  
  refresh(){
    this.isShowRefreshSpin= true;
    this.orderList(this.orderDate,this.orderType, this.orderStatus, this.page)
    this.orderCount();
  }

  orderList(order_date?: any, order_type?:any, order_status?:any, page?:any,search_text?:any) {
    this.orderService.orderList(order_date, order_type, order_status,page,search_text);
    this.order$ = this.orderService.getOrder();
    this.showPaginator= false;
    this.isShowRefreshSpin= true;
    this.order$.subscribe((data: any) => {
      let self= this;
      setTimeout(function(){
        self.isShowRefreshSpin= false;
      },500)
      this.copyOrderData= [];
      this.orderData = data?.result?.results;
      this.copyOrderData= this.orderData;
      this._unfilteredOptions=[];
      this._unfilteredStatus=[];
      if(this.orderData){
        this.ordersListCount= data.result.count;
        this.showPaginator= true;
        this.orderData.forEach((element:any) => {
          if(element?.assigned_order.length > 0){
            if(!(this._unfilteredOptions.indexOf(element?.assigned_order[0]?.driver?.first_name+" "+element?.assigned_order[0]?.driver?.last_name) > -1)){
              this._unfilteredOptions.push(element?.assigned_order[0]?.driver?.first_name+" "+element?.assigned_order[0]?.driver?.last_name)
            }
          }
          if(!(this._unfilteredStatus.indexOf(element?.order_status) >-1)){
            if(!(this._unfilteredStatus.indexOf(element?.order_status) > -1)){
              this._unfilteredStatus.push(element?.order_status)
            }
          }
        });
      }
      this.options = this._unfilteredOptions;
      this.statusOptions= this._unfilteredStatus;

    },(err)=>{
      this.isShowRefreshSpin= false;
    });
  }

  updateOrderList(e : any , val:string){
    if(e.target.value){
      this.orderData = this.copyOrderData.filter((element:any)=>{
        return element?.assigned_order[0]?.driver?.first_name+" "+element?.assigned_order[0]?.driver?.last_name == val
      })
    }
  }
  
  orderCount(order_date?: any, order_type?:any) {
    this.orderService.orderCount(order_date, order_type);
    this.orderCount$ = this.orderService.getOrderCount();

    this.orderCount$.subscribe((data: any) => {
      this.orderCountData = data?.result;
      this.makeDefaultCount();
      if(data && data.result ){
        if(data.result.today.length > 0){
          data?.result.today.forEach((element:any) => {
            this.showUpdatedItem(element);
          });
        }
        if(data.result.all.length > 0){

          data?.result.all.forEach((element:any) => {
            this.updateAllCount(element);
          });
          this.preparePendingOrdersCount(data?.result.all)

        } else if(data.result.all.length == 0){
          this.makeDefaultCount();
        }
       
      }
      
    });
  }

  convertTime24To12(val:any){
    if(val != 'null' && val != '' && val){
      let timeWithout00=val.split(':');
      var time:any = timeWithout00[0]+':'+timeWithout00[1];
      time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
      if (time.length > 1) { // If time format correct
        time = time.slice (1);  // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      
      return time.join('');
    }
   
  }
  getDateTime(item:any,status: string){
    //if shipped time is not there then make enroute time as shipped time
    // let obj = {
    //   "status": "shipped",
    //   "updated_at": "2023-09-30T07:12:40.614870Z",
    //   "updated_by": "sandeep@gmail.com",
    //   "status_reason": []
    // };
    // let shippedItem = item?.status_history.find((item:any) => item.status == 'shipped');
    // if(shippedItem == undefined){
    //   let enRouteItem = item?.status_history.find((item:any) => item.status == 'en-route');
    //   if(enRouteItem){
    //     obj.updated_at= enRouteItem.updated_at;
    //     obj.updated_by= enRouteItem.updated_by;
    //     obj.status_reason= enRouteItem.status_reason;
    //     item.status_history.push(obj);
    //   }
    // }
    // //end
    var sitem = item?.status_history.find((item:any) => item.status === status);
    if(sitem){
      console.log(sitem)
      return sitem.updated_at;
    } else{
      return "NA";
    }
  }
  preparePendingOrdersCount(orders:any){
    let count = 0;
    orders.forEach((el: any) => {
      if(el.order_status == 'pending' || el.order_status == 'shipped' || el.order_status == 'en-route'){
        count = count + el.count;
      }
    });
    this.pendingOrdersCount= count;
  }
  makeDefaultCount(){
    this.allOrdersCount=[
      {
        "order_status": "all",
        "count": 0
      },
      {
        "order_status": "pending",
        "count": 0
      },
      {
        "order_status": "successful",
        "count": 0
      },
      {
        "order_status": "unsuccessful",
        "count": 0
      },
      {
        "order_status": "cancelled",
        "count": 0
      },   
      {
        "order_status": "shipped",
        "count": 0
      }, 
      {
        "order_status": "en-route",
        "count": 0
      },   
    ]
  }

  updateAllCount(newItem:any){
    let updateItem = this.allOrdersCount.find(this.findIndexToUpdateAllCount, newItem.order_status);
    let index = this.allOrdersCount.indexOf(updateItem);
    this.allOrdersCount[index].count = newItem.count;
  }
  findIndexToUpdateAllCount(newItem:any) { 
    return newItem.order_status === this;
  }
  showUpdatedItem(newItem:any){
    let updateItem = this.todayOrdersCount.find(this.findIndexToUpdate, newItem.order_type);
    let index = this.todayOrdersCount.indexOf(updateItem);
    this.todayOrdersCount[index].count = newItem.count;
  }
  
  findIndexToUpdate(newItem:any) { 
    return newItem.order_type === this;
  }
  onClickTodaysOrder(type:string){
    this.page= 0;
    this.startNumber = 1;
    this.endNumber= 10;
    this.selectedDateVal= null;
    for (let index = 0; index < this.todayOrdersCount.length; index++) {
      if(this.todayOrdersCount[index].order_type == type){
        this.todayOrdersCount[index].isActive = !this.todayOrdersCount[index].isActive;
      } else{
        this.todayOrdersCount[index].isActive = false;
      }
    }
    if (!(type == this.orderType)) {
      let date = new Date();
      let formatDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      this.orderDate = formatDate;
      this.orderType = type;
      this.orderList(this.orderDate, this.orderType, this.orderStatus, this.page);
      this.orderCount(this.orderDate, this.orderType);
    } else {
      this.orderType = null;
      this.orderDate = null;
      this.orderList(this.orderDate, this.orderType, this.orderStatus, this.page);
      this.orderCount(this.orderDate, this.orderType);
    }
    
  }
  selectedDate(event:any){
    for (let index = 0; index < this.todayOrdersCount.length; index++) {
        this.todayOrdersCount[index].isActive = false;
    }
    this.orderDate= event.target.value;
    this.orderType= null;
    this.orderList(event.target.value, this.orderType, this.orderStatus, this.page);
    this.orderCount(this.orderDate, this.orderType);

  }
  handlePageEvent(e: any) {
    this.page= e.pageIndex;
    this.orderList(this.orderDate, this.orderType, this.orderStatus, this.page)
  }
  onClickStatus(status:string){
    this.page= 0;
    this.startNumber = 1;
    this.endNumber= 10;
    for (let index = 0; index < this.allOrdersCount.length; index++) {
      if(this.allOrdersCount[index].order_status == status){
        this.allOrdersCount[index].isActive = !this.allOrdersCount[index].isActive;
      } else{
        this.allOrdersCount[index].isActive = false;
      }
    }
    if (!(status == this.orderStatus)) {
      this.orderStatus = status;
      this.orderList(this.orderDate, this.orderType, this.orderStatus, this.page);
    } else {
      this.orderStatus = null;
      this.orderList(this.orderDate, this.orderType, this.orderStatus, this.page);
    }
  }
  getCountOfTodayOrders(){
    return this.todayOrdersCount[1].count + this.todayOrdersCount[2].count;
  }
  getCountOfAllOrders(){
    return this.allOrdersCount.reduce((acc:any, el:any) => acc + el.count, 0)
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
      this.isShowContactDialog= !this.isShowContactDialog;

  }

  driverList(id?: number) {
    this.data= []
    this.driverService.driverList(id);
    this.driver$ = this.driverService.getDrivers();

    this.driver$.subscribe((data: any) => {
      if (data && data.result && data.result.results) {
        this.data= [];
        data.result.results.forEach((data: any) => {
          this.data.push({
            value: data?.id,
            label: data?.first_name + ' ' + data?.last_name,
          });
        });
        this.driverData = [];
        this.driverData= data.result.results;
      }
    });
  }
  onClickPushNotification(){
    this.isShowPushNotificationForm = !this.isShowPushNotificationForm;
  }

  updateAsign(id: number, e: any) {
    if (e.target.checked) {
      this.assignArr.push(id);
    } else {
      this.assignArr.pop(id);
    }
  }
  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = reader.result
      };

      reader.readAsDataURL(file);
    }
  }
  public filterOptione(filter: any): void {
    this.options = this._unfilteredOptions.filter((x:any) => x.toLowerCase().includes(filter.target.value.toLowerCase()));
   }
   public filterStatusOptione(filter: any): void {
    this.statusOptions = this._unfilteredStatus.filter((x:any) => x.toLowerCase().includes(filter.target.value.toLowerCase()));
   }
   openDriversFilter(){
    this.isShowDriversFilter= !this.isShowDriversFilter;
   }
   openStatusFilter(){
    this.isShowStatusFilter= !this.isShowStatusFilter;
   }
   onClickPhone(index:any){
    this.phoneIndex = index;
    this.isShowContactDialog= !this.isShowContactDialog;
  }
  orderDelete(id: any) {
    this.isShowDeleteOrdersDialog= false;
    this.toggle[id] = true;
    this.delloading = true;
    this.showPaginator= false;

    this.orderService.orderDelete(id).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.delloading = false;
          return;
        }
        this.showPaginator= true;
        this.backToNormalMode();
        this.orderList();
        this.toastr.success('Order Deleted');
        this.delloading = false;
      },
      (error) => {
        this.authService.dataError(error);
        this.delloading = false;
      }
    );
  }

  sendNotification(enterAnimationDuration: string,
    exitAnimationDuration: string,driverId?:any, customerPhoneNo?:string,orderId?:any){
      const dialogRef = this.dialog.open(SendNotificationComponent, {
        width:"50%",
        enterAnimationDuration,
        exitAnimationDuration,
        panelClass: 'order-detail',
        data: {
          title:'Send Notification To Driver/Customer',
          btns: ['Close','Send'],
          isShowSelectGroupSection: true,
          userId: driverId,
          customerId: customerPhoneNo,
          orderId: orderId
        },
      });
      dialogRef.afterClosed().subscribe((dialogResult:any) => {
        if(dialogResult){
        }
      });
    }

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.addAssign.invalid) {
      return;
    }
    this.loading= true;
    // console.log('Api Data Err ffff', this.f, this.frmValues);

    var formdata = new FormData();
    formdata.append('order_ids', JSON.stringify(this.assignArr));
    formdata.append('driver_id', this.f['driver_id'].value);

    let assignedCount= 0;
    this.driverData.forEach((element:any) => {
      if(element.id == this.f['driver_id'].value){
        assignedCount = element.assigned_orders_count;
      }
    });

    if(assignedCount != 0){
      let enterAnimationDuration= "250ms";
      let exitAnimationDuration= "250ms";
  
      const dialogRef = this.dialog.open(DialogAnimationsComponent, {
        height: '500px',
        enterAnimationDuration,
        exitAnimationDuration,
        panelClass: 'order-detail',
        data: {
          title: 'Do you want to assign this order to driver?',
          pageName: 'order-details',
          driverData: {
            id: this.f['driver_id'].value,
            assignedOrdersCount:assignedCount,
            isShowDropdownValues: false,
            isShowAssignedCount: true

          },
          
          message:
            '',
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if(dialogResult){
          if(dialogResult.res){
            this.assignOrder(formdata);
          }
        }
      });
    } else{
      this.assignOrder(formdata)
    }
    
  }

  assignOrder(formdata:any){
    this.orderService.orderAssign(formdata).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.loading = false;
          return;
        }
        this.orderList(this.orderDate, this.orderType, this.orderStatus, this.page);
        this.addAssign.patchValue({
          driver_id : null
        })
        this.isSubmitted = false;
        this.toastr.success(data?.resultDescription);
        this.router.navigate([
          '/' + this.authService._isRoleName + '/dashboard',
        ]);
        this.loading = false;
      },
      (error) => {
        this.authService.dataError(error);
        this.loading = false;
      }
    );
  }

  nextPage(){
      if(this.endNumber < this.ordersListCount){
        this.page = this.page + 1;
        this.startNumber= (this.page * 10)+1;
        this.endNumber= this.startNumber + 10-1;
      } else if(this.endNumber == this.ordersListCount){
        this.page = this.page + 1;
        this.endNumber = this.ordersListCount;
        this.startNumber= (this.page * 10)+1;
      }
      this.orderList(this.orderDate, this.orderType, this.orderStatus, this.page)
  }
  prevPage(){

    if(this.page > 0){
      this.page = this.page - 1;
      this.startNumber= (this.page * 10)+1;
      this.endNumber= this.startNumber + 10-1;
    }
    
    this.orderList(this.orderDate, this.orderType, this.orderStatus, this.page)

  }

  onClickDeleteOrderDialog(e:any, id:any){
    e.preventDefault()
    this.deleteOrderId= id;
    this.isShowDeleteOrdersDialog = !this.isShowDeleteOrdersDialog;
  }

  viewAll(){
    this.isViewAllMode= true;
    this.orderStatus= null;
    this.orderDate= null;
    this.orderType= null;
    this.page= 0;
    this.startNumber = 1;
    this.endNumber= 10;
    this.orderList(this.orderDate,this.orderType, this.orderStatus, this.page);
    this.orderCount(this.orderDate, this.orderType);
  }

  backToNormalMode(){
    this.isViewAllMode= false;
    this.orderStatus= null;
    this.orderDate= null;
    this.orderType= null;
    this.page= 0;
    this.startNumber = 1;
    this.endNumber= 10;
    this.orderList(this.orderDate,this.orderType, this.orderStatus, this.page);
    this.orderCount(this.orderDate, this.orderType);
  }

  setPriority(enterAnimationDuration:string,exitAnimationDuration:string, id:string){
      const dialogRef = this.dialog.open(DialogAnimationsComponent, {
        height: '500px',
        enterAnimationDuration,
        exitAnimationDuration,
        panelClass: 'order-listing-dialog',
        data: {
          title: 'Set the Priority',
          pageName: 'order-listing',
          orderListingData: {
            totalOrders: this.ordersListCount,
            order_id: id
          },
          message:'',
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if(dialogResult){
          if(dialogResult){
            this.orderStatus= null;
            this.orderDate= null;
            this.orderType= null;
            this.page= 0;
            this.startNumber = 1;
            this.endNumber= 10;
            this.orderList(this.orderDate,this.orderType, this.orderStatus, this.page);
          }
        }
      });
  }

}
