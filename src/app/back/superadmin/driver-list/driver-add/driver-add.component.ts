import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';
import { DriverService } from 'src/app/_service/driver.service';
import { PlanService } from 'src/app/_service/plan.service';

@Component({
  selector: 'app-driver-add',
  templateUrl: './driver-add.component.html',
  styleUrls: ['./driver-add.component.css'],
})
export class DriverAddComponent {
  addDriver!: FormGroup;
  loading = false;
  isSubmitted = false;
  imageSrc: any = 'assets/images/sper-top-icon02.png';
  fileName: any;

  id: Number;
  isAddMode: boolean;
  editDriver: any;

  certificatesItems: any = [
    'License',
    'Abstract',
    'Certificate',
    'CVOR',
    'Safety',
    'Insurance',
    'Add More',
  ];

  drivers$!: Observable<object[]>;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public driverService: DriverService,
    private toastr: ToastrService
  ) {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.addDriver = formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      phone_number: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      address: ['', [Validators.required]],
      is_head_driver: [''],
      is_active: [''],
      image: [''],
      certificates: [''],
    });

    if (!this.isAddMode) {
      this.driverService.driverList(this.id);
      this.drivers$ = this.driverService.getDrivers();

      this.drivers$.subscribe((data: any) => {
        this.editDriver = data?.results;
        if (data?.results?.img) {
          this.imageSrc = data?.results?.img;
        }
        this.addDriver.patchValue(data?.results);
      });
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addDriver.controls;
  }

  // convenience getter for easy access to form values
  get frmValues() {
    return this.addDriver.value;
  }

  ngOnInit(): void {}

  handleSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.addDriver.invalid) {
      return;
    }

    this.loading = true;
    // console.log('Api Data Err ffff', this.f, this.frmValues);

    const formData = new FormData();
    for (let i in this.addDriver.value) {
      if (this.addDriver.value[i] instanceof Blob) {
        formData.append(
          i,
          this.addDriver.value[i],
          this.addDriver.value[i].name ? this.addDriver.value[i].name : ''
        );
        // console.log('blob');
      } else {
        formData.append(i, this.addDriver.value[i]);
      }
    }

    if (this.isAddMode) {
      this.driverService.driverAdd(formData).subscribe(
        (data: any) => {
          if (this.authService.resultCodeError(data)) {
            this.loading = false;
            return;
          }

          this.toastr.success(data?.actionPerformed);
          this.router.navigate([
            '/' + this.authService._isRoleName + '/driver',
          ]);
        },
        (error) => {
          this.authService.dataError(error);
          this.loading = false;
        }
      );
    } else {
      this.driverService.driverEdit(this.id, formData).subscribe(
        (data: any) => {
          if (this.authService.resultCodeError(data)) {
            this.loading = false;
            return;
          }

          this.toastr.success(data?.actionPerformed);
          this.router.navigate([
            '/' + this.authService._isRoleName + '/driver',
          ]);
        },
        (error) => {
          this.authService.dataError(error);
          this.loading = false;
        }
      );
    }
  }

  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log('image', file);

      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);
      this.addDriver.patchValue({
        image: file,
      });

      reader.readAsDataURL(file);
    }
  }

  readCertificatesURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files;
      console.log('file', file);

      this.addDriver.patchValue({
        certificates: file,
      });
    }
  }
}
