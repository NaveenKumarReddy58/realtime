import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  forgot!: FormGroup;
  loading = false;
  isSubmitted = false;
  isOtpSent = false;
  otp: any;
  otpStatus = false;
  isVerified: any = 'f';

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

    this.forgot = formBuilder.group({
      username: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      password: ['', []],
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

  ngOnInit(): void {}

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

    this.authService.sendResetOtp(this.f['username'].value).subscribe(
      (data: any) => {
        this.loading = false;
        if (this.authService.resultCodeError(data)) {
          this.loading = false;
          return;
        }

        this.toastr.success('OTP Sent!');
        this.isOtpSent = true;
        this.loading = false;
      },
      (error) => {
        this.authService.dataError(error);
        this.loading = false;
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

    this.otpStatus = false;
    if (this.otp === undefined) {
      this.otpStatus = true;
      this.loading = false;
      return;
    }

    this.isVerified = 'f';

    this.authService
      .verifyResetOtp(this.f['username'].value, this.otp)
      .subscribe(
        (data: any) => {
          if (this.authService.resultCodeError(data)) {
            this.loading = false;
            return;
          }

          this.isVerified = 't';
          this.toastr.success(data.message);
          this.authService.setLS('isverified', this.isVerified);
          this.router.navigate(['/reset']);
        },
        (error) => {
          this.authService.dataError(error);
          this.loading = false;
        }
      );
  }
}
