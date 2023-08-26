import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';
import { DriverService } from 'src/app/_service/driver.service';
import { DialogAnimationsComponent } from 'src/app/back/common/dialog-animations/dialog-animations.component';
import { ReusableGoogleMapComponent } from 'src/app/reusable-google-map/reusable-google-map.component';
import { SendNotificationComponent } from 'src/app/send-notification/send-notification.component';
declare var google: {
  maps: {
    Geocoder: new () => any;
    places: { Autocomplete: new (arg0: any) => any };
  };
};
@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.css']
})
export class DriverDetailsComponent {
  public editDriverForm: any;
  public isEditMode: boolean = false;
  driverId: any;
  isEnabledSave: boolean = false;
  isActivate: any;
  delloading: boolean = false;
  isShowRecentNotifications: boolean = false;
  geoCoder: any;
  isSubmitted: boolean = false;
  todayOrderCount: number=0;
  pendingOrderCount: number=0;
  successfullOrderCount: number=0;
  unSuccessfullOrderCount: number=0;
  tripHistory: any;



  constructor(private dialog: MatDialog,
    private authService: AuthService, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private router: Router, private driverService: DriverService) {
    this.editDriverForm = formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: [
        '',
        [Validators.required],
      ],
      address: ['', [Validators.required]],
      is_head_driver: [''],
      is_active: ['true'],
      image: [''],
      driver_insurance: [''],
      certificates: [''],
      country_code: [''],
      driver_license: [''],
      driver_safety: [''],
      driver_abstract: [''],
      driver_certificate: [''],
      driver_cvor: [''],
      date_joined: [''],
      profile_img: ['assets/images/profilephoto.png'],
      push_notification: ['', [Validators.required]]

    })
    let driverId = this.activatedRoute.snapshot.paramMap.get('id');
    this.driverId = driverId;
    this.getDriverDetails(driverId);
  }
  getDriverDetails(driverId: string | null) {
    this.driverService.driverDetails(driverId).subscribe((res) => {
      if (res && res.result) {
        let driverDetails = res.result
        
        this.editDriverForm.patchValue({
          first_name: driverDetails.first_name,
          last_name: driverDetails.last_name,
          email: driverDetails.email,
          phone_number: driverDetails.country_code + " " + driverDetails.phone_number,
          country_code: driverDetails.country_code,
          address: driverDetails.address,
          is_active: driverDetails.is_active,
          date_joined: driverDetails.date_joined,
          profile_img: driverDetails.profile_image,
          certificates: driverDetails.certificate
        })
        if (driverDetails.groups[0].name == 'Head Driver') {
          this.editDriverForm.patchValue({
            is_head_driver: true,
          });
        }
      }
      this.getDriverOrderCounts();
    })
  }

  getDriverOrderCounts() {
    this.driverService.orderCount(this.driverId).subscribe((data: any) => {
      let driverOrderCount= data?.result;
        if(driverOrderCount?.all?.length > 0){
          driverOrderCount?.all.forEach((element:any)=>{
            if(element.order_status == 'pending'){
              this.pendingOrderCount= element.count;
            }else if(element.order_status == 'shipped'){
              this.pendingOrderCount= this.pendingOrderCount + element.count;
            }else if(element.order_status == 'successful'){
              this.successfullOrderCount= element.count;
            }else if(element.order_status == 'unsuccessful'){
              this.unSuccessfullOrderCount= element.count;
            }
          })
        }
        if(driverOrderCount?.today?.length > 0){
          driverOrderCount?.today.forEach((element:any)=>{
              this.todayOrderCount= this.todayOrderCount + element.count;
          })
        }
    });
  }

  
  ngOnInit() {
  }

  toggleStatus(e: any) {
    this.isEnabledSave = true;
    this.isActivate = !e;
    this.updateDriverStatus();
  }

  updateDriverStatus() {
    this.delloading = true;
    var formdata = new FormData();
    formdata.append('status', this.isActivate);
    this.driverService.driverActivateDeactivate(this.driverId, formdata).subscribe((res) => {
      this.isEnabledSave = false;
      this.delloading = false;
      this.getDriverDetails(this.driverId);
      this.toastr.success(res.result);
    }, (err) => {
      this.toastr.error("Failed to update");
      this.delloading = false;
    })
  }

  edit() {
    this.router.navigate(['admin/driver/edit', this.driverId]);
  }
  sendNotification(enterAnimationDuration: string,
    exitAnimationDuration: string,userId?:any, groupType:string='Driver'){
      const dialogRef = this.dialog.open(SendNotificationComponent, {
        width:"50%",
        enterAnimationDuration,
        exitAnimationDuration,
        panelClass: 'order-detail',
        data: {
          title:'Send Notification To '+groupType,
          btns: ['Close','Send'],
          isShowSelectGroupSection: false,
          groupType: groupType,
          userId: userId
          
        },
      });
      dialogRef.afterClosed().subscribe((dialogResult:any) => {
        if(dialogResult){
        }
      });
    }
  showRecentNotifications() {
    this.isShowRecentNotifications = true;

    this.driverService.orderHistory(this.driverId).subscribe((data: any) => {
        this.tripHistory= data?.result?.results;      
    });

  }
  closeRecentNotifications() {
    this.isShowRecentNotifications = false;
  }
  viewOrder(id:number){
    this.router.navigate(['admin/orders/detail', id])
  }
  deleteDriver() {

    let enterAnimationDuration = '200ms';
    let exitAnimationDuration = '200ms';

    const dialogRef = this.dialog.open(DialogAnimationsComponent, {
      width: '450px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: 'Alert?',
        message:
          'Are you sure want to delete this Driver?',
      },
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.delloading = true;
        this.driverService.driverDelete(this.driverId).subscribe(
          (data: any) => {
            if (this.authService.resultCodeError(data)) {
              this.delloading = false;
              return;
            }
            this.router.navigate(['/admin/driver']);
            this.toastr.success('Driver Deleted');
            this.delloading = false;
          },
          (error) => {
            this.authService.dataError(error);
            this.delloading = false;
          }
        );
      }
    });

  }
  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

  }
  sendPushNotification() {
    this.isSubmitted = true;

  }
  showOrdersList(status:string) {
    let enterAnimationDuration, exitAnimationDuration = '250ms';
    const dialogRef = this.dialog.open(DialogAnimationsComponent, {
      height: '500px',
      enterAnimationDuration,
      exitAnimationDuration,
      panelClass: 'order-detail',
      data: {
        title: 'List of Orders',
        pageName: 'driver-details',
        btns:['Close'],
        driverData: {
          id: this.driverId,
          status: status,
          isDriverDetailsPage: true,
          isShowDropdownValues: false,
          isShowAssignedCount: false
        },
      },
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {

      }
    });
  }
  trackDriver() {

    let enterAnimationDuration = '200ms';
    let exitAnimationDuration = '200ms';

    const dialogRef = this.dialog.open(ReusableGoogleMapComponent, {
      width: '750px',
      height: '500px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        height: '500px',
      },

    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {

      }
    });
  }
}
