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
  isAddMode: boolean= true;
  editDriver: any;
  countryCodes: any = CountryPhoneCodes;
  certificatesItems: any = [
    {
      name: 'License',
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
      name: 'Safety Certificate',
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
  moreCertificates: any=[];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public driverService: DriverService,
    private toastr: ToastrService
  ) {
    this.id = this.route.snapshot.params['id'];
    

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
      driver_insurance:[''],
      certificates: [''],
      country_code:[''],
      driver_license:[''],
      driver_safety:[''],
      driver_abstract:[''],
      driver_certificate:[''],
      driver_cvor:[''],
      other_certificates:[]
    });
    if(this.id){
      this.getDriverDetails(this.id);
      this.isAddMode = false;
      this.addDriver.get('password')?.clearValidators();

    }
    if (this.isAddMode) {
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

  getDriverDetails(driverId: any) {
    this.driverService.driverDetails(driverId).subscribe((res)=>{
      if(res && res.result){
        let driverDetails= res.result
        this.addDriver.patchValue({
          first_name: driverDetails.first_name,
          last_name: driverDetails.last_name,
          email: driverDetails.email,
          password: driverDetails?.password, 
          phone_number: driverDetails.phone_number,
          country_code:driverDetails.country_code,
          address: driverDetails.address,
          is_active: driverDetails.is_active,
          date_joined: driverDetails.date_joined,
          profile_img: driverDetails.profile_image,
          certificates: driverDetails.certificate,
          is_head_driver: '',
        });
        if (driverDetails.groups[0].name == 'Head Driver') {
          this.addDriver.patchValue({
            is_head_driver: true,
          });
        }
        for (let index = 0; index < this.certificatesItems.length; index++) {
          for (let j = 0; j < driverDetails.certificate.length; j++) {
            if(this.certificatesItems[index].name == driverDetails.certificate[j].doc_name){
              this.certificatesItems[index].img = driverDetails.certificate[j].image;
            }
          }
        }
        this.imageSrc= driverDetails.profile_image;
      }
    })
  }
  handleSubmit() {
    this.isSubmitted = true;
    // for (var i = 0; i < this.certificatesItems.length - 1; i++) {
    //   if (this.certificatesItems[i].img.indexOf('edit-icon') > -1) {
    //     this.isShowCertificationErr = true;
    //     return;
    //   }
    // }

    // stop here if form is invalid
    if (this.addDriver.invalid) {
      return;
    }
    if(this.moreCertificates.length > 0){
      this.addDriver.patchValue({
        other_certificates: this.moreCertificates,
      });
    }
    
    

    if(!this.isAddMode){
      this.addDriver.patchValue({
        is_head_driver: this.addDriver.value['is_head_driver'],
      });
    } else{
      if (this.addDriver.value['is_head_driver'] == '') {
        this.addDriver.patchValue({
          is_head_driver: true,
        });
      }
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

          this.toastr.success(data?.resultDescription);

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
              const index = this.certificatesItems.findIndex((object:any) => {
                return object.name === 'Add more';
              });
              this.certificatesItems[i].name = index+event.target.files[0].name;
              this.certificatesItems[i].originalName= 'Add more';
            }
          }
        }
      };

      let fArr = [];
      for (var i = 0; i < file.length; i++) {
        fArr.push(file[i]);
        console.log('certificates' + i, file[i]);
      }
      if(this.certificateName == 'Licence'){
        this.addDriver.patchValue({
          driver_license: singleFile,
        });
      } else if(this.certificateName == 'CVOR'){
        this.addDriver.patchValue({
          driver_cvor: singleFile,
        });
      } else if(this.certificateName == 'Insurance'){
        this.addDriver.patchValue({
          driver_insurance: singleFile,
        });
      } else if(this.certificateName == 'Certificate'){
        this.addDriver.patchValue({
          driver_certificate: singleFile,
        });
      } else if(this.certificateName == 'Abstract'){
        this.addDriver.patchValue({
          driver_abstract: singleFile,
        });
      } else if(this.certificateName == 'Safety'){
        this.addDriver.patchValue({
          driver_safety: singleFile,
        });
      } else if(this.certificateName == 'Add more'){
        this.moreCertificates.push(singleFile) 
        
      }
      

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
      if (this.certificatesItems[i].name == imgName) {
        if(this.certificatesItems[i].originalName == 'Add more'){
          this.certificatesItems[i].name= 'Add more';
          this.certificatesItems[i].img = 'assets/images/edit-icon.png';
          this.removeDuplicateAddMores(this.certificatesItems);
        } else{
          this.certificatesItems[i].img = 'assets/images/edit-icon.png';

        }
      }
    }
  }
  removeDuplicateAddMores(arr:any){
    
    const uniqueIds:any = [];
    
    const unique = arr.filter((element:any) => {
      const isDuplicate = uniqueIds.includes(element.name);
    
      if (!isDuplicate) {
        uniqueIds.push(element.name);
    
        return true;
      }
    
      return false;
    });
    this.certificatesItems= unique;
  }
  removeProfilePhoto(e: any) {
    e.stopPropagation();
    this.imageSrc = 'assets/images/profilephoto.png';
  }
}
