import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlanService } from '../_service/plan.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
export interface DialogData {
  title: string;
  message: string;
  btns: any;
  isShowSelectGroupSection?: boolean;
  groupType?: string;
  userId?:any;
  customerId?:any;
}
@Component({
  selector: 'app-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.css']
})
export class SendNotificationComponent {
  imageSrc: any= "../../assets/images/photoupload.png";
  selectedGroup: string= 'Customer';
  isSending: boolean= false;
  sendNotificationForm!: FormGroup;


  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,private formBuilder: FormBuilder, private toastr: ToastrService, public dialogRef: MatDialogRef<SendNotificationComponent>,private planService: PlanService){
    this.sendNotificationForm = formBuilder.group({
      title: ['', [Validators.required]],
      message: ['', [Validators.required]],
      notification_image: ['']
    });
  }
  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = reader.result
        this.sendNotificationForm.patchValue({
          notification_image: file,
        });
      };

      reader.readAsDataURL(file);
    }
  }
  selectGroup(val:string){
     this.selectedGroup = val;
  }

  onDismiss(val:boolean): void {
    this.dialogRef.close(val);
  }
  send(){
    const formData = new FormData();
    for (let i in this.sendNotificationForm.value) {
      if (this.sendNotificationForm.value[i] instanceof Blob) {
        formData.append(
          i,
          this.sendNotificationForm.value[i],
          this.sendNotificationForm.value[i].name ? this.sendNotificationForm.value[i].name : ''
        );
      } else {
        formData.append(i, this.sendNotificationForm.value[i]);
      }
    }
    if(this.data.groupType){
      formData.append("send_to_group", this.data.groupType)
    } else{
      formData.append("send_to_group", this.selectedGroup)
    }
    if(this.data.userId || this.data.customerId){
      if(this.selectedGroup == 'Driver' || this.data.groupType == 'Driver'){
        formData.append("send_to_user", this.data.userId)
      } else if(this.selectedGroup == 'Customer' || this.data.groupType == 'Customer'){
        formData.append("send_to_user", this.data.customerId)
      }
    }

    this.isSending= true;
      this.planService.sendNotificationToGroup(formData).subscribe((res:any)=>{
        this.isSending= false;
        this.toastr.success(res?.resultDescription)
        this.onDismiss(true)
      } , (err:any)=>{
        this.isSending= false;
        this.toastr.error("Failed to Send Notification")
      })
  }
  
}
