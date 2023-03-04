import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  fileName: any;

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
      max_drivers: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      max_admin: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      valid_for: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      desecription: ['', [Validators.required]],
      img: [''],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
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
    // console.log('Api Data Err ffff', this.f, this.frmValues);

    const formData = new FormData();
    for (let i in this.addPlan.value) {
      if (this.addPlan.value[i] instanceof Blob) {
        formData.append(
          i,
          this.addPlan.value[i],
          this.addPlan.value[i].name ? this.addPlan.value[i].name : ''
        );
        console.log('blob');
      } else {
        formData.append(i, this.addPlan.value[i]);
      }
    }

    this.planService.add(formData).subscribe(
      (data: any) => {
        if (
          data?.resultCode === '0' ||
          data?.resultCode == 4 ||
          data?.resultCode == 0
        ) {
          console.log('Api Data Err', data);
          this.toastr.error(data.errorMessage);
          return;
        }

        this.toastr.success(data.actionPerformed);
        this.router.navigate(['/plans']);
      },
      (error) => {
        console.log('Api Err', error);
        this.loading = false;
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
