import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { AddressService } from 'src/app/_service/address.service';
import { AuthService } from 'src/app/_service/auth.service';
import { OrderService } from 'src/app/_service/order.service';
import { WarehouseService } from 'src/app/_service/warehouse.service';
import { AddressAddComponent } from '../../address-list/address-add/address-add.component';
import { CountryPhoneCodes } from 'src/app/_interface/country-phone-codes';

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
  data: Select2Data = [];
  warehouseData: any;
  orderData: any;
  countryCodes: any = CountryPhoneCodes;

  po: any;

  id: Number;
  isAddMode: boolean;

  address$!: Observable<object[]>;
  warehouse$!: Observable<object[]>;
  order$!: Observable<object[]>;

  time = { hour: 13, minute: 30 };
  isCheckedWarehous: any = [{ pickup: false }, { to: false }];
  isPickupWareHouseEnabled: boolean =false;
  isDelyWareHouseEnabled: boolean= false;
  addressPickup$: any;
  addressDely$: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public warehouseService: WarehouseService,
    public addressService: AddressService,
    public orderService: OrderService,
    private toastr: ToastrService,

    public dialog: MatDialog
  ) {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.addOrderF = formBuilder.group({
      po: [''],
      pickup_company_name: ['', [Validators.required]],
      pickup_address: ['', [Validators.required]],
      is_pickup_warehouse: ['', [Validators.required]],
      pickup_date: ['', [Validators.required]],
      pickup_time: [''],
      pickup_contact_name: ['', [Validators.required]],
      pickup_email: ['', [Validators.required, Validators.email]],
      pickup_country_code: ['+91'],
      pickup_phone: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      pickup_alt_phone: [
        '',
        [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      pickup_note: [''],
      dely_company_name: ['', [Validators.required]],
      dely_address: ['', [Validators.required]],
      is_dely_warehouse: [''],
      dely_date: ['', [Validators.required]],
      dely_time: [''],
      dely_contact_name: ['', [Validators.required]],
      dely_email: ['', [Validators.required, Validators.email]],
      dely_phone: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      dely_country_code: ['+91'],
      dely_alt_phone: [
        '',
        [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      dely_note: [''],
      order_no: [''],
    });


    this.addressList();
    this.warehouseList();
    this.addOrderF.patchValue({ po: this.po });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addOrderF.controls;
  }

  // convenience getter for easy access to form values
  get frmValues() {
    return this.addOrderF.value;
  }

  ngOnInit(): void {
    this.setTheValidatorsForPOON();
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    addressType:string
  ): void {
    const dialogRef = this.dialog.open(AddressAddComponent, {
      width: '800px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        isCloseBtn: true
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        let self = this;
        this.addressList();
        setTimeout(function(){
          if(addressType == 'pickup'){
            self.addOrderF.patchValue({
              pickup_address: self.addressData[self.addressData.length-1].id,
            });
          } else if(addressType == 'to'){
            self.addOrderF.patchValue({
              dely_address: self.addressData[self.addressData.length-1].id,
            });
          }
        },1500)
      }
      
    })
  }
  setTheLatestAddress(addressType:any){
    this.addressService.addressSearch();
    this.address$ = this.addressService.getAddress();
    this.address$.subscribe((data: any) => {
      this.addressData = data.result;
      if (data?.result) {
        this.data=[];
        data?.result.forEach((data: any) => {
          this.data.push({
            value: data?.id,
            label: data?.address,
          });
        });
      }
    });
  }
  orderDetail(id: number) {
    this.orderService.editOrder(id).subscribe(
      (data: any) => {
        this.loading = false;
        if (this.authService.resultCodeError(data)) {
          this.loading = false;
          return;
        }
        this.orderData = data?.result;
        if(this.orderData.is_pickup_warehouse){
          this.isCheckedWarehous[1].to = false;
          this.isCheckedWarehous[0].pickup = true;
        } else if(this.orderData.is_dely_warehouse){
          this.isCheckedWarehous[1].to = true;
          this.isCheckedWarehous[0].pickup = false;
        }
       
        this.addOrderF.patchValue({
          po: this.orderData?.po,
          pickup_company_name: this.orderData?.pickup_company_name,
          pickup_address: this.orderData?.pickup_address?.id,
          is_pickup_warehouse: this.orderData.is_pickup_warehouse,
          pickup_date: this.orderData?.pickup_date,
          pickup_time: this.orderData?.pickup_time,
          pickup_contact_name: this.orderData?.pickup_contact_name,
          pickup_email: this.orderData?.pickup_email,
          pickup_country_code: this.orderData?.country_code,
          pickup_phone: this.orderData?.pickup_phone,
          pickup_alt_phone: this.orderData?.pickup_alt_phone,
          pickup_note: this.orderData?.pickup_note?this.orderData?.pickup_note : '',
          dely_company_name: this.orderData?.dely_company_name,
          dely_address: this.orderData?.dely_address?.id,
          is_dely_warehouse: this.orderData?.is_dely_warehouse,
          dely_date: this.orderData?.dely_date,
          dely_time: this.orderData?.dely_time,
          dely_contact_name: this.orderData?.dely_contact_name,
          dely_email:this.orderData?.dely_email,
          dely_phone: this.orderData?.dely_phone,
          dely_country_code: this.orderData?.country_code,
          dely_alt_phone: this.orderData?.dely_alt_phone,
          dely_note: this.orderData?.dely_note?this.orderData?.dely_note : '',
          order_no: this.orderData?.order_no,
        });
        this.loading = false;
      },
      (error) => {
        this.authService.dataError(error);
        this.loading = false;
      }
    );
  }

  addressList() {
    this.addressService.addressSearch();
    this.address$ = this.addressService.getAddress();

    this.address$.subscribe((data: any) => {
      this.addressData = data.result;
      if (data?.result) {
        this.data=[];
        data?.result.forEach((data: any) => {
          this.data.push({
            value: data?.id,
            label: data?.address,
          });
        });
        
        if (!this.isAddMode) {
          this.orderDetail(this.route.snapshot.params['id']);
        }
      }
    });
  }

  warehouseList() {
    this.warehouseService.warehouseList();
    this.warehouse$ = this.warehouseService.getWarehouse();

    this.warehouse$.subscribe((data: any) => {
      if(data && data.result){

        data.result.forEach((element:any) => {
          if(element.is_main_localation){
            this.warehouseData = element;
          }
        });
      }
      
    });
  }

  isAlphaNumeric(event:any , inputType:string){
    if(inputType == 'PO'){
      if( event.target.value.match(/^[a-zA-Z0-9]+$/)){
        this.addOrderF.patchValue({
          po: event.target.value
        })
      } else{
        let val= event.target.value.replace(event.key , '')
        this.addOrderF.patchValue({
          po: val
        })
      }
    }else if(inputType == 'ON'){
      if( event.target.value.match(/^[a-zA-Z0-9]+$/)){
        this.addOrderF.patchValue({
          order_no: event.target.value
        })
      } else{
        let val= event.target.value.replace(event.key , '')
        this.addOrderF.patchValue({
          order_no: val
        })
      }
    }
    
  }
  setPickupWarehouse(e: any) {
    if (e.target.checked) {
      this.addOrderF.patchValue({
        pickup_address: this.warehouseData?.address?.id,
      });
    } else {
      this.addOrderF.patchValue({ pickup_address: null });
      this.addOrderF.patchValue({ dely_address: null });
    }
  }

  setDelyWarehouse(e: any) {
    if (e.target.checked) {
      this.addOrderF.patchValue({
        dely_address: this.warehouseData?.address?.id,
      });
    } else {
      this.addOrderF.patchValue({ pickup_address: null });
      this.addOrderF.patchValue({ dely_address: null });
    }
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
  changeStatus(name: string, value: boolean) {
    
    if (name == 'to') {
      if (value) {
        this.isCheckedWarehous[1].to = false;
      } else if (this.isCheckedWarehous[0].pickup) {
        this.isCheckedWarehous[1].to = true;
        this.isCheckedWarehous[0].pickup = false;
      } else if (!value) {
        this.isCheckedWarehous[1].to = true;
      }
    } else {
      if (value) {
        this.isCheckedWarehous[0].pickup = false;
      } else if (this.isCheckedWarehous[1].to) {
        this.isCheckedWarehous[0].pickup = true;
        this.isCheckedWarehous[1].to = false;
      } else if (!value) {
        this.isCheckedWarehous[0].pickup = true;
      }
    }
    if (this.isCheckedWarehous[0].pickup) {
      this.isPickupWareHouseEnabled = true;
      this.isDelyWareHouseEnabled = false;

      this.addOrderF.patchValue({
        pickup_address: this.warehouseData?.address?.id,
        pickup_company_name: this.warehouseData?.warehouse_name,
        pickup_contact_name: this.warehouseData?.contact_name,
        pickup_phone: this.warehouseData?.phone,
        pickup_email: this.warehouseData?.email,
        pickup_alt_phone: this.warehouseData?.alt_phone

      });
      this.setNullDelyValue();
    }
    else if(this.isCheckedWarehous[1].to){
      this.isPickupWareHouseEnabled = false;
      this.isDelyWareHouseEnabled = true;
      this.addOrderF.patchValue({
        dely_address: this.warehouseData?.address?.id,
        dely_company_name: this.warehouseData?.warehouse_name,
        dely_contact_name: this.warehouseData?.contact_name,
        dely_email:this.warehouseData?.email,
        dely_phone: this.warehouseData?.phone,
        dely_alt_phone: this.warehouseData?.alt_phone
      });
      this.setNullPickupValue();
    } else{
      this.isPickupWareHouseEnabled = false;
      this.isDelyWareHouseEnabled = false;
      this.setNullDelyValue();
      this.setNullPickupValue();
    }

    this.setTheValidatorsForPOON();
  }
  setTheValidatorsForPOON(){
    if(!this.isCheckedWarehous[1].to){
      this.addOrderF.controls['order_no'].setValidators([Validators.required]);
    } else{
      this.addOrderF.patchValue({order_no: ''})
      this.addOrderF.controls['order_no'].clearValidators();
    }
    if(!this.isCheckedWarehous[0].pickup){
      this.addOrderF.controls['po'].setValidators([Validators.required]);
    } else{
      this.addOrderF.patchValue({po: ''})
      this.addOrderF.controls['po'].clearValidators();
    }

    this.addOrderF.controls['po'].updateValueAndValidity();
    this.addOrderF.controls['order_no'].updateValueAndValidity();

  }
  setNullPickupValue(){
    this.addOrderF.patchValue( {
      pickup_address: null,
      pickup_company_name: null,
      pickup_contact_name: null,
      pickup_phone: null,
      pickup_email: null,
      pickup_alt_phone: null
    });
  }
  setNullDelyValue(){
    this.addOrderF.patchValue({ 
      dely_address: null,
      dely_company_name: null,
      dely_contact_name: null,
      dely_email:null,
      dely_phone: null,
      dely_alt_phone: null
     });
  }
}
