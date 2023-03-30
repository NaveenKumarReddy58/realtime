import { Component, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Validation from 'src/app/_helper/validation';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  reset!: FormGroup;
  loading = false;
  isSubmitted = false;
  orgEmail: any;
  isverified: any;

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

    this.orgEmail = this.authService.getOrgEmail;
    this.isverified = this.authService.getLS('isverified');

    if (this.isverified !== 't') {
      this.router.navigate(['/']);
    }

    this.reset = formBuilder.group(
      {
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [Validation.match('password', 'confirmPassword')],
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.reset.controls;
  }

  // convenience getter for easy access to form values
  get frmValues() {
    return this.reset.value;
  }

  ngOnInit(): void {}

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.reset.invalid) {
      return;
    }

    this.loading = true;

    this.authService
      .resetPassword(this.orgEmail, this.f['password'].value)
      .subscribe(
        (data: any) => {
          this.loading = false;
          if (this.authService.resultCodeError(data)) {
            return;
          }

          this.toastr.success(data?.actionPerformed);
          this.authService.rmLS('isverified');
          this.router.navigate(['/']);
        },
        (error) => {
          this.authService.dataError(error);
          this.loading = false;
        }
      );
  }
}
