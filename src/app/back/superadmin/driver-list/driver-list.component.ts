import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';
import { DriverService } from 'src/app/_service/driver.service';
import { PlanService } from 'src/app/_service/plan.service';
import { DialogAnimationsComponent } from '../../common/dialog-animations/dialog-animations.component';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css'],
})
export class DriverListComponent {
  expandedIndex = 0;
  items: any;

  loading = false;
  delloading = false;
  toggle: any = [];

  driver$!: Observable<object[]>;
  isShowDeleteDriverDialog: boolean= false;
  phoneIndex: any;
  isShowContactDialog: boolean= false;
  selectedDriversCount: any=0;
  isShowPushNotificationForm: boolean= false;
  imageSrc: any= "../../assets/images/photoupload.png";
  activeDriversCount: any= 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public planService: PlanService,
    public authService: AuthService,
    public driverService: DriverService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.driverList();
  }
  ngOnInit(): void {

  }

  driverList(id?: number) {
    this.driverService.driverList(id);
    this.driver$ = this.driverService.getDrivers();

    this.driver$.subscribe((data: any) => {
      if(data && data.result && data.result.results){
        this.items = data.result.results;
        this.items.forEach((obj:any) => obj["checked"] = false)
        this.getCountOfActiveDrivers();
      }
    });

    // this.items =  [
    //     {
    //       "id": 3,
    //       "first_name": "Driver ",
    //       "last_name": "Once",
    //       "email": "driverone@gmail.com",
    //       "groups": [
    //         {
    //           "id": 3,
    //           "name": "Head Driver"
    //         }
    //       ],
    //       "is_active": true,
    //       "checked": false,
    //       "phone_number": "+917528943768",
    //       "address": "Mohali",
    //       "date_joined": "2023-03-12T10:24:44.513807Z",
    //       "user_timezone": "Asia/Kolkata",
    //       "profile_image": "https://rtt-assests.s3.amazonaws.com/profile-images/Screenshot_2023-02-02_at_10.47.22_PM.png",
    //       "certificate": [
    //         {
    //           "id": 4,
    //           "image": null
    //         },
    //         {
    //           "id": 5,
    //           "image": null
    //         },
    //         {
    //           "id": 6,
    //           "image": "https://rtt-assests.s3.amazonaws.com/driver-certificates/Screenshot_2023-02-06_at_6.49.06_PM.png"
    //         }
    //       ]
    //     },
    //     {
    //       "id": 4,
    //       "checked": false,
    //       "first_name": "Mohit",
    //       "last_name": "Kumar",
    //       "email": "mohit@gmail.com",
    //       "groups": [
    //         {
    //           "id": 3,
    //           "name": "Head Driver"
    //         }
    //       ],
    //       "is_active": false,
    //       "phone_number": "+919646646757",
    //       "address": "chandigarh",
    //       "date_joined": "2023-03-12T17:56:35.764016Z",
    //       "user_timezone": "Asia/Kolkata",
    //       "profile_image": "https://rtt-assests.s3.amazonaws.com/profile-images/default.png",
    //       "certificate": [
    //         {
    //           "id": 7,
    //           "image": "https://rtt-assests.s3.amazonaws.com/driver-certificates/default.png"
    //         },
    //         {
    //           "id": 8,
    //           "image": "https://rtt-assests.s3.amazonaws.com/driver-certificates/default.png"
    //         },
    //         {
    //           "id": 9,
    //           "image": "https://rtt-assests.s3.amazonaws.com/driver-certificates/default.png"
    //         }
    //       ]
    //     },
    //     {
    //       "id": 6,
    //       "checked": false,
    //       "first_name": "Sandeep ",
    //       "last_name": "Singh",
    //       "email": "flutterguruu@gmail.com",
    //       "groups": [
    //         {
    //           "id": 3,
    //           "name": "Head Driver"
    //         }
    //       ],
    //       "is_active": false,
    //       "phone_number": "7528943768",
    //       "address": "chandigarh",
    //       "date_joined": "2023-03-23T18:48:10.546247Z",
    //       "user_timezone": "Asia/Kolkata",
    //       "profile_image": "https://rtt-assests.s3.amazonaws.com/profile-images/_18760.png",
    //       "certificate": [
    //         {
    //           "id": 13,
    //           "image": "https://rtt-assests.s3.amazonaws.com/driver-certificates/_18760.png"
    //         },
    //         {
    //           "id": 14,
    //           "image": "https://rtt-assests.s3.amazonaws.com/driver-certificates/_18760.png"
    //         },
    //         {
    //           "id": 15,
    //           "image": "https://rtt-assests.s3.amazonaws.com/driver-certificates/_18760.png"
    //         }
    //       ]
    //     },
    //     {
    //       "id": 7,
    //       "checked": false,
    //       "first_name": "Soam",
    //       "last_name": "Kumar",
    //       "email": "sonam2@gmail.com",
    //       "groups": [
    //         {
    //           "id": 3,
    //           "name": "Head Driver"
    //         }
    //       ],
    //       "is_active": true,
    //       "phone_number": "9646646757",
    //       "address": "chandigarh",
    //       "date_joined": "2023-04-09T06:09:16.190343Z",
    //       "user_timezone": "Asia/Kolkata",
    //       "profile_image": "https://rtt-assests.s3.amazonaws.com/profile-images/freelogo2.png",
    //       "certificate": [
    //         {
    //           "id": 16,
    //           "image": "https://rtt-assests.s3.amazonaws.com/driver-certificates/freelogo2.png"
    //         },
    //         {
    //           "id": 17,
    //           "image": "https://rtt-assests.s3.amazonaws.com/driver-certificates/freelogo2.png"
    //         },
    //         {
    //           "id": 18,
    //           "image": "https://rtt-assests.s3.amazonaws.com/driver-certificates/freelogo2.png"
    //         }
    //       ]
    //     }
    //   ]
  }

  getCountOfActiveDrivers(){
    this.activeDriversCount = this.items.reduce((counter:any, obj:any) => obj.is_active === true ? counter += 1 : counter, 0);
  }
  getSelectedDrivers(dList:any){
    this.selectedDriversCount = this.items.reduce((counter:any, obj:any) => obj.checked === true ? counter += 1 : counter, 0); // 6
  }
  changeStatus(id:any , status:any){
    for(var i=0; i < this.items.length; i++){
      if(this.items[i].id == id){
        this.items[i].checked = !status;
      }
    }
    this.getSelectedDrivers(this.items)
  }
  onClickPushNotification(){
    this.isShowPushNotificationForm = !this.isShowPushNotificationForm;
  }
  selectAll(){
    for(var i=0; i < this.items.length; i++){
        this.items[i].checked = true;
    }
    this.getSelectedDrivers(this.items)
  }
  deSelectAll(){
    for(var i=0; i < this.items.length; i++){
      this.items[i].checked = false;
  }
  this.getSelectedDrivers(this.items)
  }
  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(DialogAnimationsComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  stopNav(event:any){
    event.stopPropagation();
  }
  driverActivateDeactivate(id: Number, status: any) {
    this.loading = true;
    this.driverService.driverActivateDeactivate(id, status).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.loading = false;
          return;
        }

        this.driverList();
        this.router.navigate(['/admin/driver']);
        this.toastr.success('Warehouse Status Updated');
      },
      (error) => {
        this.authService.dataError(error);
        this.loading = false;
      }
    );
  }
  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = reader.result
      };

      reader.readAsDataURL(file);
    }
  }
  onClickDeleteDriverDialog(e:any){
    e.preventDefault()
    this.isShowDeleteDriverDialog = !this.isShowDeleteDriverDialog;
  }
  onClickPhone(index:any){
    this.phoneIndex = index;
    this.isShowContactDialog= !this.isShowContactDialog;
  }
  copyText(val: string){
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
      this.isShowContactDialog= !this.isShowContactDialog;

  }
  deleteDriversList(data:any){
    this.isShowDeleteDriverDialog = !this.isShowDeleteDriverDialog;
    let selectedDrivers = this.items.filter((item:any) => item.checked);
    selectedDrivers.forEach((elt:any) => {
      this.driverDelete(elt.id);
    });
  }
  driverDelete(id: any) {
    this.toggle[id] = true;
    this.delloading = true;
    this.driverService.driverDelete(id).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.delloading = false;
          return;
        }

        this.driverList();
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
}
