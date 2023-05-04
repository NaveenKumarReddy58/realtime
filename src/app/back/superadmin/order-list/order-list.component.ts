import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';
import { DriverService } from 'src/app/_service/driver.service';
import { OrderService } from 'src/app/_service/order.service';

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
  ]
  orderDate: any;
  orderType: any;
  orderStatus: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public orderService: OrderService,
    public driverService: DriverService,
    private toastr: ToastrService
  ) {
    this.orderList();
    this.driverList(0);

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
  }

  orderList(order_date?: any, order_type?:any, order_status?:any) {
    this.orderService.orderList(order_date, order_type, order_status);
    this.order$ = this.orderService.getOrder();

    this.order$.subscribe((data: any) => {
      this.orderData = data?.result?.results;
      this._unfilteredOptions=[];
      if(this.orderData){
        this.orderData.forEach((element:any) => {
          this._unfilteredOptions.push(element?.assigned_order[0]?.driver?.first_name+" "+element?.assigned_order[0]?.driver?.last_name)
          this._unfilteredStatus.push(element?.order_status)
        });
      }
     
      this.options = this._unfilteredOptions;
      this.statusOptions= this._unfilteredStatus;

    });
  }
  
  orderCount() {
    this.orderService.orderCount();
    this.orderCount$ = this.orderService.getOrderCount();

    this.orderCount$.subscribe((data: any) => {
      this.orderCountData = data?.result;
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
        }
       
      }
      
    });
  }

  updateAllCount(newItem:any){
    let updateItem = this.allOrdersCount.find(this.findIndexToUpdateAllCount, newItem.order_status);
    let index = this.allOrdersCount.indexOf(updateItem);
    this.allOrdersCount[index] = newItem;
  }
  findIndexToUpdateAllCount(newItem:any) { 
    return newItem.order_status === this;
  }
  showUpdatedItem(newItem:any){
    let updateItem = this.todayOrdersCount.find(this.findIndexToUpdate, newItem.order_type);
    let index = this.todayOrdersCount.indexOf(updateItem);
    this.todayOrdersCount[index] = newItem;
  }
  
  findIndexToUpdate(newItem:any) { 
    return newItem.order_type === this;
  }
  onClickTodaysOrder(type:string){
    for (let index = 0; index < this.allOrdersCount.length; index++) {
      this.allOrdersCount[index].isActive = false;
    }
    for (let index = 0; index < this.todayOrdersCount.length; index++) {
      if(this.todayOrdersCount[index].order_type == type){
        this.todayOrdersCount[index].isActive = !this.todayOrdersCount[index].isActive;
      } else{
        this.todayOrdersCount[index].isActive = false;
      }
    }
    if(!(type == this.orderType) ){
      for (let index = 0; index < this.todayOrdersCount.length; index++) {
        if(this.todayOrdersCount[index].isActive){
          let date = new Date();
          let formatDate= date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDay();
          this.orderType = type;
          if(this.todayOrdersCount[index].order_type == 'both'){
            this.orderList(formatDate);
          } else{
            this.orderList(formatDate, this.orderType);
          }
        }
      }
    } else{
      this.orderList();
    }
    
  }
  selectedDate(event:any){
    this.orderDate= event.target.value;
    this.orderList(event.target.value, null, this.orderStatus);
  }
  onClickStatus(status:string){
    for (let index = 0; index < this.todayOrdersCount.length; index++) {
      this.todayOrdersCount[index].isActive = false;
    }
    for (let index = 0; index < this.allOrdersCount.length; index++) {
      if(this.allOrdersCount[index].order_status == status){
        this.allOrdersCount[index].isActive = !this.allOrdersCount[index].isActive;
      } else{
        this.allOrdersCount[index].isActive = false;
      }
    }
    if(!(status == this.orderStatus)){
      if(status == 'all'){
        this.orderList()
      } else{
        for (let index = 0; index < this.allOrdersCount.length; index++) {
          if(this.allOrdersCount[index].isActive){
            this.orderStatus= status;
          }
        }
        this.orderList(null, null, this.orderStatus);
      }
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
    this.driverService.driverList(id);
    this.driver$ = this.driverService.getDrivers();

    this.driver$.subscribe((data: any) => {
      if (data && data.result && data.result.results) {
        data.result.results.forEach((data: any) => {
          this.data.push({
            value: data?.id,
            label: data?.first_name + ' ' + data?.last_name,
          });
        });
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
    this.toggle[id] = true;
    this.delloading = true;
    this.orderService.orderDelete(id).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.delloading = false;
          return;
        }

        this.orderList();
        this.router.navigate(['/admin/dashboard']);
        this.toastr.success('Order Deleted');
        this.delloading = false;
      },
      (error) => {
        this.authService.dataError(error);
        this.delloading = false;
      }
    );
  }

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.addAssign.invalid) {
      return;
    }

    this.loading = true;
    // console.log('Api Data Err ffff', this.f, this.frmValues);

    var formdata = new FormData();
    formdata.append('order_ids', JSON.stringify(this.assignArr));
    formdata.append('driver_id', this.f['driver_id'].value);

    this.orderService.orderAssign(formdata).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.loading = false;
          return;
        }

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
}
