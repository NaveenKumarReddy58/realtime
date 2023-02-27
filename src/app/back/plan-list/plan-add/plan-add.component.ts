import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PlanService } from 'src/app/_service/plan.service';

@Component({
  selector: 'app-plan-add',
  templateUrl: './plan-add.component.html',
  styleUrls: ['./plan-add.component.css'],
})
export class PlanAddComponent {
  addPlan!: FormGroup;
  loading = false;
  isSubmitted = false;
  imageSrc: any = 'assets/images/sper-top-icon02.png';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public planService: PlanService,
    private toastr: ToastrService
  ) {
    this.addPlan = formBuilder.group({
      title: ['', [Validators.required]],
      max_drivers: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      max_admin: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      valid_for: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      desecription: ['', [Validators.required]],
      img: [''],
      price: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addPlan.controls;
  }

  // convenience getter for easy access to form values
  get frmValues() {
    return this.addPlan.value;
  }

  ngOnInit(): void { }

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.addPlan.invalid) {
      return;
    }

    this.loading = true;
    console.log('Api Data Err ffff', this.f, this.frmValues);

    this.planService.add(
      this.f['title'].value,
      this.f['max_drivers'].value,
      this.f['max_admin'].value,
      this.f['valid_for'].value,
      this.f['desecription'].value,
      // this.f['img'].value,
      this.f['price'].value
    ).subscribe(
      (data: any) => {
        console.log('Api Data Err', data);
        if (data?.resultCode == 4) {
          console.log('Api Data Err', data);
          this.toastr.error('', data.errorMessage);
          return;
        }

        this.toastr.success('Success', data.actionPerformed);
        this.router.navigate(['/plans']);
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
      this.addPlan.patchValue({
        img: file,
      });

      reader.readAsDataURL(file);
    }
  }
}
