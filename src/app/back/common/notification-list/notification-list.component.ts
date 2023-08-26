import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';
import { PlanService } from 'src/app/_service/plan.service';
import { SendNotificationComponent } from 'src/app/send-notification/send-notification.component';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css'],
})
export class NotificationListComponent {
  notificationSentList: any;
  tabName: any = 'all';
  public loader = false;
  searchValue: any;
  searchText: any;
  isClearLoading: boolean= false;
  clearNotificationId: any;
  isClearAllLoading: boolean= false;
  constructor(private toastr: ToastrService , private authService: AuthService, private dialog: MatDialog, private planService: PlanService) { }
  ngOnInit(): void {
    this.notificationList()
  }

  sendNotification(enterAnimationDuration: string,
    exitAnimationDuration: string,) {
    const dialogRef = this.dialog.open(SendNotificationComponent, {
      width: "50%",
      enterAnimationDuration,
      exitAnimationDuration,
      panelClass: 'order-detail',
      data: {
        title: 'Send Notification',
        pageName: 'order-details',
        btns: ['Close', 'Send'],
        isShowSelectGroupSection: true,
        message:
          'Do you want to assign this order to new driver?',
      },
    });
    dialogRef.afterClosed().subscribe((dialogResult: any) => {
      if (dialogResult) {
        this.notificationList();
      }
    });
  }

  notificationList() {
    this.loader = true;
    this.planService.getAdminSentNotificationList(this.tabName, this.searchValue).subscribe(
      (data: any) => {
        this.loader = false;
        if (this.authService.resultCodeError(data)) {
          return;
        }
        this.notificationSentList = data?.result?.results;
      },
      (error) => {
        this.loader = false;
        this.authService.dataError(error);
      }
    );
  }

  onTabClick(val?: string) {
    this.searchValue = null;
    this.searchText = this.searchValue;
    this.tabName = val;
    this.notificationList();
  }
  search(e: any) {
    this.searchValue = e;
    this.notificationList();
  }
  clearAll() {
    this.isClearAllLoading= true;
    this.planService.clearAllAdminNotification().subscribe((data:any)=>{
      this.isClearAllLoading= false;
      if (this.authService.resultCodeError(data)) {
        return;
      }
      this.toastr.success("All Notifications Cleared")
      this.notificationList();
    } ,(error:any)=>{
      this.isClearAllLoading= false;
      this.toastr.success("Failed to Clear. Internal Server errro ")
      this.authService.dataError(error);
    })
  }
  clearNotification(id:any){
    this.clearNotificationId = id;
    const formData= new FormData();
    formData.append('ids',JSON.stringify([Number(id)]))
    this.isClearLoading= true;
    this.planService.clearAdminNotification(formData).subscribe((data:any)=>{
      this.isClearLoading= false;
      if (this.authService.resultCodeError(data)) {
        return;
      }
      this.toastr.success("Notification Cleared")
      this.notificationList();
    } ,(error:any)=>{
      this.isClearLoading= false;
      this.toastr.success("Failed to Clear Notification. Internal Server Error")

      this.authService.dataError(error);
    })
  }

}
