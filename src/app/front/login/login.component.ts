import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  login!: FormGroup;
  loading = false;
  isSubmitted = false;
  errorMessage = false;
  actionPerformed = false;
  org_email: any;
  org_domain: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.org_email = localStorage.getItem('org_email');
    this.org_domain = localStorage.getItem('org_domain');

    if (this.org_email === null || this.org_domain === null) {
      this.router.navigate(['/']);
    }

    this.login = formBuilder.group({
      username: [this.org_email, [Validators.required, Validators.email]], //admin@gmail.com
      password: ['', Validators.required], //admin@123#
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.login.controls;
  }

  // convenience getter for easy access to form values
  get frmValues() {
    return this.login.value;
  }

  ngOnInit(): void { }

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.login.invalid) {
      return;
    }

    this.loading = true;

    this.authService
      .login(this.f['username'].value, this.f['password'].value)
      .subscribe(
        (data: any) => {
          if (data?.resultCode == 0) {
            this.loading = false;
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
