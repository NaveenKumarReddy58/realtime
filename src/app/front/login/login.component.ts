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
  orgEmail: any;
  orgDomain: any;

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
    this.orgDomain = this.authService.getOrgDomain;

    this.login = formBuilder.group({
      username: [this.orgEmail, [Validators.required, Validators.email]], //admin@gmail.com
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

  ngOnInit(): void {}

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
          this.loading = false;
          if (this.authService.resultCodeError(data)) {
            this.loading = false;
            return;
          }

          this.authService.setLS('access_token', data?.access_token);
          this.authService.setLS('refresh_token', data?.refresh_token);
          this.authService.setLS('name', data?.name);
          this.authService.setLS('role', data?.role);
          this.authService.setLS('user_timezone', data?.user_timezone);

          this.toastr.success(data?.actionPerformed);

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
