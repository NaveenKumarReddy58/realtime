import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Plan } from 'src/app/_interface/plan';
import { AuthService } from 'src/app/_service/auth.service';
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
    public authService: AuthService,
    public planService: PlanService,
    private toastr: ToastrService
  ) {
    this.addPlan = formBuilder.group({
      title: ['', [Validators.required]],
      max_drivers: ['', [Validators.required]],
      max_admin: ['', [Validators.required]],
      valid_for: ['', [Validators.required]],
      desecription: ['', [Validators.required]],
      img: ['', [Validators.required]],
      price: ['', [Validators.required]],
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

  ngOnInit(): void {}

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.addPlan.invalid) {
      return;
    }

    this.loading = true;
    console.log('Api Data Err ffff', this.f);
    const planData: Plan = this.addPlan.value; // this is now valid typescript
    this.planService.add(planData).subscribe(
      (data: any) => {
        console.log('Api Data Err', data);
        if (data?.resultCode == 0) {
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
