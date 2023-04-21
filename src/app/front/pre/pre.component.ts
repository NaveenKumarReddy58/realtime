import { trigger, transition, animate, style } from '@angular/animations';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-pre',
  templateUrl: './pre.component.html',
  styleUrls: ['./pre.component.css'],
  animations: [
    trigger('fade1', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('1500ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        style({transform: 'translateX(0%)'}),
        animate('15000ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ]),
  ],
})
export class PreComponent {
  prelogin!: FormGroup;
  loading = false;
  isSubmitted = false;
  isLoggedIn = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    if (this.authService.isOrgIn) {
      this.router.navigate(['/login']);
    }

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

  ngOnInit(): void {
    var self = this;
    setTimeout(function(){
      self.isLoggedIn = false;
    }, 500)
  }

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.prelogin.invalid) {
      return;
    }

    this.loading = true;

    this.authService.getOrganization(this.f['username'].value).subscribe(
      (data: any) => {
        this.loading = false;
        if (this.authService.resultCodeError(data)) {
          this.loading = false;
          return;
        }

        this.authService.setLS('org_email', data?.result[0]?.email);
        this.authService.setLS(
          'org_domain',
          data?.result[0]?.organization?.domain_url
        );
        this.authService._apiUrl.next(
          data?.result[0]?.organization?.domain_url +
            ':' +
            this.authService.port
        );
        this.authService.setLS('org_phone', data?.result[0]?.phone_number);
        this.authService.setLS('org_data', JSON.stringify(data));

        this.toastr.success('Organization Selected!');

        this.router.navigate(['/login']);
      },
      (error) => {
        this.authService.dataError(error);
        this.loading = false;
      }
    );
  }
}
