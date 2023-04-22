import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { CountryPhoneCodes } from 'src/app/_interface/country-phone-codes';
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
  imageSrc: any = 'assets/images/profilephoto.png';
  fileName: any;

  id: Number;
  isAddMode: boolean;
  editDriver: any;
  countryCodes: any = CountryPhoneCodes;
  certificatesItems: any = [
    {
      name: 'Licence',
      img: 'assets/images/edit-icon.png',
    },
    {
      name: 'Abstract',
      img: 'assets/images/edit-icon.png',
    },
    {
      name: 'Certificate',
      img: 'assets/images/edit-icon.png',
    },
    {
      name: 'CVOR',
      img: 'assets/images/edit-icon.png',
    },
    {
      name: 'Safety',
      img: 'assets/images/edit-icon.png',
    },
    {
      name: 'Insurance',
      img: 'assets/images/edit-icon.png',
    },
    {
      name: 'Add more',
      img: 'assets/images/edit-icon.png',
    },
  ];

  drivers$!: Observable<object[]>;
  certificateImages: any;
  certificateName: any;
  isShowCertificationErr: boolean = false;

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
      is_active: ['true'],
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
    for (var i = 0; i < this.certificatesItems.length - 1; i++) {
      if (this.certificatesItems[i].img.indexOf('edit-icon') > -1) {
        this.isShowCertificationErr = true;
        return;
      }
    }

    // stop here if form is invalid
    if (this.addDriver.invalid) {
      return;
    }

    if (this.addDriver.value['is_head_driver'] == '') {
      this.addDriver.patchValue({
        is_head_driver: false,
      });
    }

    this.loading = true;
    // console.log('Api Data Err ffff', this.f, this.frmValues);

    const formData = new FormData();
    for (let i in this.addDriver.value) {
      if (this.addDriver.value[i] instanceof Blob) {
        const files = this.addDriver.value[i];
        if (files.length > 0) {
          for (let j = 0; j < files.length; j++) {
            formData.append(i, files[j], files[j].name);
          }
        } else {
          formData.append(
            i,
            this.addDriver.value[i],
            this.addDriver.value[i].name ? this.addDriver.value[i].name : ''
          );
        }
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
      reader.onload = (e) => {
        this.imageSrc = reader.result;
      };
      this.addDriver.patchValue({
        image: file,
      });

      reader.readAsDataURL(file);
    }
  }
  onCertificateClick(certificateName: any) {
    this.certificateName = certificateName;
  }
  readCertificatesURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files;

      console.log('certificates', file);

      const singleFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        for (var i = 0; i < this.certificatesItems.length; i++) {
          if (this.certificatesItems[i].name == this.certificateName) {
            this.certificatesItems[i].img = reader.result;
            if (this.certificateName == 'Add more') {
              this.certificatesItems[i].name = event.target.files[0].name;
            }
          }
        }
      };

      let fArr = [];
      for (var i = 0; i < file.length; i++) {
        fArr.push(file[i]);
        console.log('certificates' + i, file[i]);
      }

      this.addDriver.patchValue({
        certificates: fArr,
      });

      reader.readAsDataURL(singleFile);

      setTimeout(() => {
        const i = this.certificatesItems.findIndex(
          (e: any) => e.name === 'Add more'
        );
        if (i == -1) {
          this.certificatesItems.push({
            name: 'Add more',
            img: 'assets/images/edit-icon.png',
          });
        }
      }, 500);
    }
  }
  removePhoto(e: any, imgName: any) {
    e.stopPropagation();
    for (var i = 0; i < this.certificatesItems.length; i++) {
      if (this.certificatesItems[i].name == this.certificateName) {
        this.certificatesItems[i].img = 'assets/images/edit-icon.png';
      }
    }
  }
  removeProfilePhoto(e: any) {
    e.stopPropagation();
    this.imageSrc = 'assets/images/profilephoto.png';
  }
}
