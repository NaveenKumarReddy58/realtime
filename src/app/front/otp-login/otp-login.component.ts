import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/_service/api.service';

@Component({
  selector: 'app-otp-login',
  templateUrl: './otp-login.component.html',
  styleUrls: ['./otp-login.component.css'],
})
export class OtpLoginComponent {
  otplogin!: FormGroup;
  loading = false;
  isSubmitted = false;
  isOtpSent = false;
  otp: any;
  otpStatus = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.otplogin = formBuilder.group({
      username: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      password: ['', []]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.otplogin.controls;
  }

  // convenience getter for easy access to form values
  get frmValues() {
    return this.otplogin.value;
  }

  ngOnInit(): void { }

  onOtpChange(otp: any) {
    this.otp = otp;
  }

  handleOtp() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.otplogin.invalid) {
      return;
    }

    this.loading = true;

    this.apiService.sendMobileOtp(this.f['username'].value).subscribe(
      (data: any) => {
        if (data?.resultCode === '0') {
          this.loading = false;
          console.log('Api Data Err', data);
          this.toastr.error('', data.message);
          return;
        }

        this.toastr.success('Success', 'OTP sent!');
        this.isOtpSent = true;
        this.loading = false;
      },
      (data) => {
        this.loading = false;
        console.log('Api Err', data);
        this.toastr.error('', data.message);
      }
    );
  }

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.otplogin.invalid) {
      return;
    }

    this.loading = true;

    this.otpStatus = false
    if (this.otp === undefined) {
      this.otpStatus = true
      this.loading = false;
      return;
    }

    this.apiService
      .loginByOtp(this.f['username'].value, this.otp, 'otp')
      .subscribe(
        (data: any) => {
          if (data?.resultCode == 0) {
            console.log('Api Data Err', data);
            this.toastr.error('', data.errorMessage);
            return;
          }

          localStorage.setItem('access_token', data?.access_token);
          localStorage.setItem('refresh_token', data?.refresh_token);
          localStorage.setItem('name', data?.name);
          localStorage.setItem('role', data?.role);
          localStorage.setItem('user_timezone', data?.user_timezone);

          this.toastr.success('Success', data.actionPerformed);
          this.router.navigate(['/dashboad']);
        },
        (data) => {
          this.loading = false;
          console.log('Api Err', data);
          this.toastr.error('', data.errorMessage);
          this.toastr.error('', data.actionPerformed);
        }
      );
  }
}
