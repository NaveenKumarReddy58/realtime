import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';

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
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    if (!this.authService.isOrgIn) {
      this.router.navigate(['/']);
    }

    this.otplogin = formBuilder.group({
      username: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      password: ['', []],
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

  ngOnInit(): void {}

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

    this.authService.sendMobileOtp(this.f['username'].value).subscribe(
      (data: any) => {
        if (
          data?.resultCode === '0' ||
          data?.resultCode == 4 ||
          data?.resultCode == 0
        ) {
          this.loading = false;
          console.log('Api Data Err', data);
          // this.toastr.error(data.message);
          return;
        }

        this.toastr.success('OTP Sent!');
        this.isOtpSent = true;
        this.loading = false;
      },
      (error) => {
        console.log('Api Err', error);
        this.loading = false;
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

    this.otpStatus = false;
    if (this.otp === undefined) {
      this.otpStatus = true;
      this.loading = false;
      return;
    }

    this.authService
      .loginByOtp(this.f['username'].value, this.otp, 'otp')
      .subscribe(
        (data: any) => {
          if (
            data?.resultCode === '0' ||
            data?.resultCode == 4 ||
            data?.resultCode == 0
          ) {
            console.log('Api Data Err', data);
            // this.toastr.error(data.errorMessage);
            return;
          }

          this.authService.setLS('access_token', data?.access_token);
          this.authService.setLS('refresh_token', data?.refresh_token);
          this.authService.setLS('name', data?.name);
          this.authService.setLS('role', data?.role);
          this.authService.setLS('user_timezone', data?.user_timezone);

          this.toastr.success(data.actionPerformed);
          this.router.navigate(['/dashboad']);
        },
        (error) => {
          console.log('Api Err', error);
          this.loading = false;
        }
      );
  }
}
