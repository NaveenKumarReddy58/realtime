import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { countries } from 'src/app/_interface/country-data-store';
import { AuthService } from 'src/app/_service/auth.service';
import { CompanyService } from 'src/app/_service/company.service';
import { PlanService } from 'src/app/_service/plan.service';

@Component({
  selector: 'app-company-add',
  templateUrl: './company-add.component.html',
  styleUrls: ['./company-add.component.css'],
})
export class CompanyAddComponent {
  addCP!: FormGroup;
  loading = false;
  isSubmitted = false;
  imageSrc: any = 'assets/images/profilephoto.png';
  userTimezone: any;

  public countries: any = countries;

  planItems: any;
  planCount: any;

  selectedIndex: any = 0;

  plans$!: Observable<object[]>;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public planService: PlanService,
    public authService: AuthService,
    public companyService: CompanyService,
    private toastr: ToastrService
  ) {
    this.addCP = formBuilder.group({
      name: ['', [Validators.required]],
      country: ['', [Validators.required]],
      // state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      description: ['', [Validators.required]],
      // domain_url: ['', [Validators.required]],
      admin_email: ['', [Validators.required, Validators.email]],
      plan_id: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      first_name: ['', [Validators.required]],
      // last_name: ['', [Validators.required]],
      phone_number: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      password: ['', [Validators.required]],
      logo: [''],
    });

    this.planList();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addCP.controls;
  }

  // convenience getter for easy access to form values
  get frmValues() {
    return this.addCP.value;
  }

  ngOnInit(): void {}

  planList() {
    this.planService.planList();
    this.plans$ = this.planService.getPlans();

    this.plans$.subscribe((data: any) => {
      this.planItems = data.results;
      this.planCount = data.count;
    });
  }

  choosePlan(id: Number) {
    this.selectedIndex = id;
    this.addCP.patchValue({
      plan_id: id,
    });
  }

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.addCP.invalid) {
      return;
    }

    this.loading = true;
    // console.log('Api Data Err ffff', this.f, this.frmValues);

    const formData = new FormData();
    for (let i in this.addCP.value) {
      if (this.addCP.value[i] instanceof Blob) {
        formData.append(
          i,
          this.addCP.value[i],
          this.addCP.value[i].name ? this.addCP.value[i].name : ''
        );
        // console.log('blob');
      } else {
        formData.append(i, this.addCP.value[i]);
      }
    }
    this.userTimezone = this.authService.getLS('user_timezone');
    formData.append('user_timezone', this.userTimezone);
    formData.append('state', '');
    formData.append('last_name', '');

    this.companyService.companyAdd(formData).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.loading = false;
          return;
        }

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

  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);
      this.addCP.patchValue({
        logo: file,
      });

      reader.readAsDataURL(file);
    }
  }
}
