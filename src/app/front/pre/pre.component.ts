import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-pre',
  templateUrl: './pre.component.html',
  styleUrls: ['./pre.component.css'],
})
export class PreComponent {
  prelogin!: FormGroup;
  loading = false;
  isSubmitted = false;
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

    if (this.org_email !== null || this.org_domain !== null) {
      this.router.navigate(['/login']);
    }
    // console.log('ls', this.org_email,this.org_domain)

    this.prelogin = formBuilder.group({
      username: ['', [Validators.required, Validators.email]], //admin@gmail.com
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.prelogin.controls;
  }

  // convenience getter for easy access to form values
  get frmValues() {
    return this.prelogin.value;
  }

  ngOnInit(): void {}

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.prelogin.invalid) {
      return;
    }

    this.loading = true;

    this.authService.getOrganization(this.f['username'].value).subscribe(
      (data: any) => {
        if (
          data?.resultCode === '0' ||
          data?.resultCode == 4 ||
          data?.resultCode == 0
        ) {
          this.loading = false;
          console.log('Api Data Err', data);
          this.toastr.error(data.errorMessage);
          return;
        }
        localStorage.setItem('org_email', data?.results?.email);
        localStorage.setItem('org_domain', data?.results?.domain_url);

        this.toastr.success('Organization Selected!');

        this.router.navigate(['/login']);
      },
      (error) => {
        console.log('Api Err', error);
        this.loading = false;
      }
    );
  }
}
