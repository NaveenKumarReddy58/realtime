import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddressService } from 'src/app/_service/address.service';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-address-add',
  templateUrl: './address-add.component.html',
  styleUrls: ['./address-add.component.css'],
})
export class AddressAddComponent {
  addressF!: FormGroup;
  loading = false;
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public addressService: AddressService,
    private toastr: ToastrService
  ) {
    this.addressF = formBuilder.group({
      address: ['', [Validators.required]],
      lattitude: ['', [Validators.required]],
      longitute: ['', [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addressF.controls;
  }

  // convenience getter for easy access to form values
  get frmValues() {
    return this.addressF.value;
  }

  ngOnInit(): void {}

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.addressF.invalid) {
      return;
    }

    this.loading = true;
    console.log('Api Data Err ffff', this.f, this.frmValues);

    const formData = new FormData();
    for (let i in this.addressF.value) {
      if (this.addressF.value[i] instanceof Blob) {
        formData.append(
          i,
          this.addressF.value[i],
          this.addressF.value[i].name ? this.addressF.value[i].name : ''
        );
        // console.log('blob');
      } else {
        formData.append(i, this.addressF.value[i]);
      }
    }

    this.addressService.addressAdd(formData).subscribe(
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
