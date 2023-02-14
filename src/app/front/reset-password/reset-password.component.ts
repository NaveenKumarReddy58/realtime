import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Validation from 'src/app/_helper/validation';
import { ApiService } from 'src/app/_service/api.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  reset!: FormGroup;
  loading = false;
  isSubmitted = false;
  org_email: any;
  isverified: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {

    this.org_email = localStorage.getItem('org_email');
    this.isverified = localStorage.getItem('isverified');

    if (this.isverified !== 't') {
      this.router.navigate(['/']);
    }

    this.reset = formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: [Validation.match('password', 'confirmPassword')]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.reset.controls;
  }

  // convenience getter for easy access to form values
  get frmValues() {
    return this.reset.value;
  }

  ngOnInit(): void { }

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.reset.invalid) {
      return;
    }

    this.loading = true;

    this.apiService
      .resetPassword(this.org_email, this.f['password'].value)
      .subscribe(
        (data: any) => {
          if (data?.resultCode == 0) {
            this.loading = false;
            console.log('Api Data Err', data);
            this.toastr.error('', data.errorMessage);
            return;
          }

          this.toastr.success('Success', data.actionPerformed);
          localStorage.removeItem('isverified');
          this.router.navigate(['/']);
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