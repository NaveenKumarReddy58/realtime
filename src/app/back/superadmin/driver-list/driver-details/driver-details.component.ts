import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DriverService } from 'src/app/_service/driver.service';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.css']
})
export class DriverDetailsComponent {
  public editDriverForm:any;
  public isEditMode: boolean= false;
  driverId: any;
  isEnabledSave: boolean = false;
  isActivate: any;
  delloading: boolean= false;
  
  constructor( private toastr: ToastrService, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder,private router: Router , private driverService: DriverService){
    this.editDriverForm = formBuilder.group({
      first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
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
        date_joined:[''],
        profile_img:['assets/images/profilephoto.png']

    })
    let driverId = this.activatedRoute.snapshot.paramMap.get('id');
    this.driverId = driverId;
    this.getDriverDetails(driverId);
  }
  getDriverDetails(driverId: string | null) {
    this.driverService.driverDetails(driverId).subscribe((res)=>{
      if(res && res.result){
        console.log(res.result)
        let driverDetails= res.result
        this.editDriverForm.patchValue({
          first_name: driverDetails.first_name,
          last_name: driverDetails.last_name,
          email: driverDetails.email,
          phone_number: driverDetails.phone_number,
          address: driverDetails.address,
          is_active: driverDetails.is_active,
          date_joined: driverDetails.date_joined,
          profile_img: driverDetails.profile_image,
          certificates: driverDetails.certificate
        })
      }
    })
  }

  ngOnInit(){

  }

  toggleStatus(e:any){
    this.isEnabledSave= true;
    this.isActivate = !e;
  }

  updateDriverStatus(){
    this.delloading= true;
    var formdata = new FormData();
    formdata.append('status', this.isActivate);
    this.driverService.driverActivateDeactivate(this.driverId , formdata).subscribe((res)=>{
      this.isEnabledSave= false;
      this.delloading= false;
      this.getDriverDetails(this.driverId);
      this.toastr.success(res.result);
    }, (err)=>{
      this.toastr.error("Failed to update");
      this.delloading= false;
    })
  }
}
