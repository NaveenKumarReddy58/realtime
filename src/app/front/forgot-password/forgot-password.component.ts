import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/_service/api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgot!: FormGroup;
  loading = false;
  isSubmitted = false;
  isOtpSent = false;
  otp: any;
  otpStatus = false
  isVerified: any = 'f'

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.forgot = formBuilder.group({
      username: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      password: ['', []]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgot.controls;
  }

  // convenience getter for easy access to form values
  get frmValues() {
    return this.forgot.value;
  }

  ngOnInit(): void { }

  onOtpChange(otp: any) {
    this.otp = otp;
  }

  handleOtp() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.forgot.invalid) {
      return;
    }

    this.loading = true;

    this.apiService.sendResetOtp(this.f['username'].value).subscribe(
      (data: any) => {
        if (data?.resultCode === '0') {
          this.loading = false;
          console.log('Api Data Err', data);
          this.toastr.error('', data.errorMessage);
          return;
        }

        this.toastr.success('Success', 'OTP sent!');
        this.isOtpSent = true;
        this.loading = false;
      },
      (data) => {
        this.loading = false;
        console.log('Api Err', data);
        this.toastr.error('', data.errorMessage);
      }
    );
  }

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.forgot.invalid) {
      return;
    }

    this.loading = true;

    this.otpStatus = false
    if (this.otp === undefined) {
      this.otpStatus = true
      this.loading = false;
      return;
    }

    this.isVerified = 'f'

    this.apiService
      .verifyResestOtp(this.f['username'].value, this.otp)
      .subscribe(
        (data: any) => {
          if (data?.resultCode == 0) {
            console.log('Api Data Err', data);
            this.toastr.error('', data.message);
            return;
          }

          this.isVerified = 't'
          this.toastr.success('Success', data.message);
          localStorage.setItem('isverified', this.isVerified);
          this.router.navigate(['/reset']);
        },
        (data) => {
          this.loading = false;
          console.log('Api Err', data);
          this.toastr.error('', data.message);
        }
      );
  }
}
