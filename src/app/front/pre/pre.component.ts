import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';
import {
  trigger,
  style,
  animate,
  transition,
  group,
  query,
  animateChild,
  keyframes
} from '@angular/animations';

@Component({
  selector: 'app-pre',
  templateUrl: './pre.component.html',
  styleUrls: ['./pre.component.css'],
  animations: [
    trigger('query', [
      transition(':enter', [
        style({ height: 0 }),
        group([
          animate(500, style({ height: '*' })),
          query(':enter', [
            style({ opacity: 0, transform: 'scale(0)'}),
            animate(2000, style({ opacity: 1, transform: 'scale(1)' }))
          ])
        ]),
        query('@animateMe', animateChild()),
      ]),
      transition(':leave', [
        style({ height: '*' }),
        query('@animateMe', animateChild()),
        group([
          animate('500ms 500ms', style({ height: '0', padding: '0' })),
          query(':leave', [
            style({ opacity: 1, transform: 'scale(1)'}),
            animate('1s', style({ opacity: 0, transform: 'scale(0)' }))
          ])
        ]),
      ]),
    ]),
    trigger('animateMe', [
    ]),
  ]
})
export class PreComponent {
  prelogin!: FormGroup;
  loading = false;
  isSubmitted = false;
  org_email: any;
  org_domain: any;
  toggleDisabled = false;
  
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

  ngOnInit(): void { }

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.prelogin.invalid) {
      return;
    }

    this.loading = true;

    this.authService.getOrganization(this.f['username'].value).subscribe(
      (data: any) => {
        if (data?.resultCode === '0') {
          this.loading = false;
          console.log('Api Data Err', data);
          this.toastr.error('', data.errorMessage);
          return;
        }
        localStorage.setItem('org_email', data?.results?.email);
        localStorage.setItem('org_domain', data?.results?.domain_url);

        this.toastr.success('Success', 'Organization selected!');

        this.router.navigate(['/login']);
      },
      (data) => {
        this.loading = false;
        console.log('Api Err', data);
        this.toastr.error('', data.errorMessage);
      }
    );
  }
}
