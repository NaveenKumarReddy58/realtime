import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { CountryPhoneCodes } from 'src/app/_interface/country-phone-codes';
import { AddressService } from 'src/app/_service/address.service';
import { AuthService } from 'src/app/_service/auth.service';
import { WarehouseService } from 'src/app/_service/warehouse.service';

@Component({
  selector: 'app-warehouse-add',
  templateUrl: './warehouse-add.component.html',
  styleUrls: ['./warehouse-add.component.css'],
})
export class WarehouseAddComponent {
  addWare!: FormGroup;
  loading = false;
  isSubmitted = false;
  addressData: any;
  data: Select2Data = [];
  countryCodes: any = CountryPhoneCodes;

  id: Number;
  isAddMode: boolean;

  address$!: Observable<object[]>;
  warehouse$!: Observable<object[]>;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public warehouseService: WarehouseService,
    public addressService: AddressService,
    private toastr: ToastrService
  ) {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.addWare = formBuilder.group({
      warehouse_name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      contact_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      alt_phone: [''],
      is_main_localation: [false],
      country_code: ['']
    });

    if (!this.isAddMode) {
      this.warehouseService.warehouseDetails(this.id);
      this.warehouse$ = this.warehouseService.getWarehouse();

      this.warehouse$.subscribe((data: any) => {
        this.addWare.patchValue({
          warehouse_name: data?.result?.warehouse_name,
          address: data?.result?.address?.id,
          contact_name: data?.result?.contact_name,
          email: data?.result?.email,
          phone: data?.result?.phone,
          alt_phone: data?.result?.alt_phone,
          is_main_localation: data?.result?.is_main_localation,
          country_code: data.result?.country_code
        });
      });
    }

    this.addressList('all');
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addWare.controls;
  }

  // convenience getter for easy access to form values
  get frmValues() {
    return this.addWare.value;
  }

  ngOnInit(): void {}

  addressList(page:any) {
    this.addressService.addressSearch(page);
    this.address$ = this.addressService.getAddress();

    this.address$.subscribe((data: any) => {
      this.addressData = data?.result?.results;
      if (data?.result?.results) {
        this.data= [];
        data?.result?.results.forEach((data: any) => {
          this.data.push({
            value: data?.id,
            label: data?.address,
          });
        });
      }
    });
  }

  changeAddress(e: any) {
    this.addWare.patchValue({
      address: e.target.value,
    });
  }

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.addWare.invalid) {
      return;
    }

    this.loading = true;

    const formData = new FormData();
    for (let i in this.addWare.value) {
      if (this.addWare.value[i] instanceof Blob) {
        formData.append(
          i,
          this.addWare.value[i],
          this.addWare.value[i].name ? this.addWare.value[i].name : ''
        );
      } else {
        formData.append(i, this.addWare.value[i]);
      }
    }

    if (this.isAddMode) {
      this.warehouseService.warehouseAdd(formData).subscribe(
        (data: any) => {
          if (this.authService.resultCodeError(data)) {
            this.loading = false;
            return;
          }

          this.toastr.success(data?.resultDescription);
          this.router.navigate([
            '/' + this.authService._isRoleName + '/warehouse',
          ]);
        },
        (error) => {
          this.authService.dataError(error);
          this.loading = false;
        }
      );
    } else {
      this.warehouseService.warehouseEdit(this.id, formData).subscribe(
        (data: any) => {
          if (this.authService.resultCodeError(data)) {
            this.loading = false;
            return;
          }

          this.toastr.success(data?.resultDescription);
          this.router.navigate([
            '/' + this.authService._isRoleName + '/warehouse',
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
