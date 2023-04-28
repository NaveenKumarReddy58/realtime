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
  orderCountData: any;
  id: any;
  optionstype: any = 'all';
  buttonData: any = ['Unassigned', 'Pending', 'Cancelled', 'Successful'];

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
  }

  orderList(filter?: any) {
    this.orderService.orderList(filter);
    this.order$ = this.orderService.getOrder();

    this.order$.subscribe((data: any) => {
      this.orderData = data?.result?.results;
      this._unfilteredOptions=[];
      this.orderData.forEach((element:any) => {
        this._unfilteredOptions.push(element?.assigned_order[0]?.driver?.first_name+" "+element?.assigned_order[0]?.driver?.last_name)
        this._unfilteredStatus.push(element?.order_status)
      });

      this.options = this._unfilteredOptions;
      this.statusOptions= this._unfilteredStatus;

    });
  }
  
  orderCount() {
    this.orderService.orderCount();
    this.orderCount$ = this.orderService.getOrderCount();

    this.orderCount$.subscribe((data: any) => {
      this.orderCountData = data?.result;
    });
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

  updateAsign(id: number, e: any) {
    if (e.target.checked) {
      this.assignArr.push(id);
    } else {
      this.assignArr.pop(id);
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
