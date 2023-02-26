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
  styleUrls: ['./plan-add.component.css']
})
export class PlanAddComponent {

  addPlan!: FormGroup;
  loading = false;
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public plan: PlanService,
    private toastr: ToastrService
  ) {
    this.addPlan = formBuilder.group({
      title: ['', [Validators.required]],
      max_drivers: ['', [Validators.required]],
      max_admin: ['', [Validators.required]],
      valid_for: ['', [Validators.required]],
      desecription: ['', [Validators.required]],
      img: ['', [Validators.required]],
      price: ['', [Validators.required]]
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
    console.log('Api Data Err ffff', this.f);
    const planData: Plan = this.addPlan.value; // this is now valid typescript
    this.plan.add(planData)
      .subscribe(
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

  getFile(e: any) {

    let extensionAllowed = { "png": true, "jpeg": true };
    console.log(e.target.files);
    if (e.target.files[0].size / 1024 / 1024 > 20) {
      alert("File size should be less than 20MB")
      return;
    }
    // if (extensionAllowed) {
    //   var nam = e.target.files[0].name.split('.').pop();
    //   if (!extensionAllowed[nam]) {
    //     alert("Please upload " + Object.keys(extensionAllowed) + " file.")
    //     return;
    //   }
    // }
    this.addPlan.controls["img"].setValue(e.target.files[0]);

  }
}
