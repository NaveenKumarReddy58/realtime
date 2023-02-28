import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  planItems: any;
  planCount: any;

  selectedIndex: any = 0;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public planService: PlanService,
    private toastr: ToastrService
  ) {
    this.addCP = formBuilder.group({
      name: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      description: ['', [Validators.required]],
      // domain_url: ['', [Validators.required]],
      admin_email: ['', [Validators.required, Validators.email]],
      plan_id: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      phone_number: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      password: ['', [Validators.required]],
      logo: [''],
    });

    this.list();
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

  list() {
    this.planService.list().subscribe(
      (data: any) => {
        if (data?.resultCode == 4) {
          console.log('Api Data Err', data);
          this.toastr.error('', data.errorMessage);
          return;
        }

        this.planItems = data.results;
        this.planCount = data.count;

        // console.log('data', data);
        // this.toastr.success('Success', data.actionPerformed);
      },
      (data) => {
        this.loading = false;
        console.log('Api Err', data);
      }
    );
  }

  choosePlan(id: Number) {
    this.selectedIndex = id;
    console.log(id, this.selectedIndex);
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
        console.log('blob');
      } else {
        formData.append(i, this.addCP.value[i]);
      }
    }
    this.userTimezone = localStorage.getItem('user_timezone');
    formData.append('user_timezone', this.userTimezone);

    this.planService.cpAdd(formData).subscribe(
      (data: any) => {
        if (data?.resultCode == 4) {
          console.log('Api Data Err', data);
          this.toastr.error('', data.errorMessage);
          return;
        }

        this.toastr.success('Success', data.actionPerformed);
        this.router.navigate(['/dashboad']);
      },
      (data) => {
        this.loading = false;
        console.log('Api Err', data);
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
