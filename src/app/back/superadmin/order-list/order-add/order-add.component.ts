import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AddressService } from 'src/app/_service/address.service';
import { AuthService } from 'src/app/_service/auth.service';
import { OrderService } from 'src/app/_service/order.service';
import { WarehouseService } from 'src/app/_service/warehouse.service';

@Component({
  selector: 'app-order-add',
  templateUrl: './order-add.component.html',
  styleUrls: ['./order-add.component.css'],
})
export class OrderAddComponent {
  addOrderF!: FormGroup;
  loading = false;
  isSubmitted = false;
  addressData: any;
  warehouseData: any;
  orderData: any;

  id: Number;
  isAddMode: boolean;

  address$!: Observable<object[]>;
  warehouse$!: Observable<object[]>;
  order$!: Observable<object[]>;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public warehouseService: WarehouseService,
    public addressService: AddressService,
    public orderService: OrderService,
    private toastr: ToastrService
  ) {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.addOrderF = formBuilder.group({
      po: ['', [Validators.required]],
      pickup_company_name: ['', [Validators.required]],
      pickup_address: ['', [Validators.required]],
      is_pickup_warehouse: ['', [Validators.required]],
      pickup_date: ['', [Validators.required]],
      pickup_time: ['', [Validators.required]],
      pickup_contact_name: ['', [Validators.required]],
      pickup_email: ['', [Validators.required]],
      pickup_phone: ['', [Validators.required]],
      pickup_alt_phone: ['', [Validators.required]],
      pickup_note: ['', [Validators.required]],
      dely_company_name: ['', [Validators.required]],
      dely_address: ['', [Validators.required]],
      is_dely_warehouse: ['', [Validators.required]],
      dely_date: ['', [Validators.required]],
      dely_time: ['', [Validators.required]],
      dely_contact_name: ['', [Validators.required]],
      dely_email: ['', [Validators.required]],
      dely_phone: ['', [Validators.required]],
      dely_alt_phone: ['', [Validators.required]],
      dely_note: ['', [Validators.required]],
      // order_no: ['', [Validators.required]],
    });

    if (!this.isAddMode) {
      this.warehouseService.warehouseList(this.id);
      this.warehouse$ = this.warehouseService.getWarehouse();

      this.warehouse$.subscribe((data: any) => {
        this.addOrderF.patchValue({
          warehouse_name: data?.result?.warehouse_name,
          address: data?.result?.address?.id,
          contact_name: data?.result?.contact_name,
          email: data?.result?.email,
          phone: data?.result?.phone,
          alt_phone: data?.result?.alt_phone,
          is_main_localation: data?.result?.is_main_localation,
        });
      });
    }

    this.addressList();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addOrderF.controls;
  }

  // convenience getter for easy access to form values
  get frmValues() {
    return this.addOrderF.value;
  }

  ngOnInit(): void {}

  addressList() {
    this.addressService.addressSearch();
    this.address$ = this.addressService.getAddress();

    this.address$.subscribe((data: any) => {
      this.addressData = data.result;
    });
  }

  warehouseList() {
    this.warehouseService.warehouseList();
    this.warehouse$ = this.warehouseService.getWarehouse();

    this.warehouse$.subscribe((data: any) => {
      this.warehouseData = data?.result;
    });
  }

  orderList(id?: number, filter?: any) {
    this.orderService.orderList(id, filter);
    this.order$ = this.orderService.getOrder();

    this.order$.subscribe((data: any) => {
      this.orderData = data?.result?.results;
    });
  }

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.addOrderF.invalid) {
      return;
    }

    this.loading = true;
    console.log('Api Data Err ffff', this.f, this.frmValues);

    const formData = new FormData();
    for (let i in this.addOrderF.value) {
      if (this.addOrderF.value[i] instanceof Blob) {
        formData.append(
          i,
          this.addOrderF.value[i],
          this.addOrderF.value[i].name ? this.addOrderF.value[i].name : ''
        );
        // console.log('blob');
      } else {
        formData.append(i, this.addOrderF.value[i]);
      }
    }

    if (this.isAddMode) {
      this.orderService.orderAdd(formData).subscribe(
        (data: any) => {
          if (this.authService.resultCodeError(data)) {
            this.loading = false;
            return;
          }

          this.toastr.success(data?.resultDescription);
          this.router.navigate([
            '/' + this.authService._isRoleName + '/dashboard',
          ]);
        },
        (error) => {
          this.authService.dataError(error);
          this.loading = false;
        }
      );
    } else {
      this.orderService.orderEdit(this.id, formData).subscribe(
        (data: any) => {
          if (this.authService.resultCodeError(data)) {
            this.loading = false;
            return;
          }

          this.toastr.success(data?.resultDescription);
          this.router.navigate([
            '/' + this.authService._isRoleName + '/dashboard',
          ]);
        },
        (error) => {
          this.authService.dataError(error);
          this.loading = false;
        }
      );
    }
  }
}
