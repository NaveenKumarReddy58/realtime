import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  ProfileFor!: FormGroup;
  profileData: any;
  loading = false;
  isSendOTPSuccess: boolean= false;
  imageSrc: any = 'assets/images/profilephoto.png';

  profile$!: Observable<object[]>;
  isSubmitted: boolean= false;
  isLoading: boolean= false;
  sendOtp$!: Observable<any>;
  isOtpSent: boolean = false;
  upLoading: boolean =false;
  otp: any;
  verifyOtp$!: Observable<any>;
  resetPassword$!: any;
  phone_number = '7528943768';
  otpSubmitted: boolean= false;
  isProfileSubmitted: boolean= false;
  profileUpdate$: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.ProfileFor = formBuilder.group({
      pswd: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      email: ['', [Validators.required]],
      profile_image:[''],
      country_code: ['+91']
    });

    this.getProfile();
  }
  ngOnInit(): void {
  }

  getProfile() {
    this.profile$ = this.authService.getProfile();

    this.profile$.subscribe((data: any) => {
      this.profileData = data?.result;
      this.ProfileFor.patchValue({
        first_name: this.profileData?.first_name,
        last_name: this.profileData?.last_name,
        phone_number: this.profileData?.phone_number,
        email: this.profileData?.email,
        profile_image: this.profileData?.profile_image,

      })
      this.imageSrc= this.profileData?.profile_image;
      this.phone_number= this.profileData?.phone_number
    });
  }

  onOtpChange(otp: any){
    this.otp= otp;
  }
  saveChanges(){
    this.isProfileSubmitted= true;
    if(this.ProfileFor.controls['first_name'].status == 'INVALID' || 
    this.ProfileFor.controls['last_name'].status == 'INVALID' ||
    this.ProfileFor.controls['email'].status == 'INVALID' ||
    this.ProfileFor.controls['phone_number'].status == 'INVALID'){
      return;
    }

    this.loading = true;

    const formData = new FormData();
    for (let i in this.ProfileFor.value) {
      if (this.ProfileFor.value[i] instanceof Blob) {
        formData.append(
          i,
          this.ProfileFor.value[i],
          this.ProfileFor.value[i].name ? this.ProfileFor.value[i].name : ''
        );
        // console.log('blob');
      } else {
        formData.append(i, this.ProfileFor.value[i]);
      }
    }

    this.profileUpdate$ = this.authService.profileUpdate(formData);

    this.profileUpdate$.subscribe((data: any) => {
      this.isLoading= false;
      this.toastr.success(data.resultDescription)
      this.getProfile()
    }, (err:any)=>{
      this.isLoading= false;
      this.toastr.error("Failed to Update")
    });
  }
  sendOTP(){
    this.isSubmitted= true;
    if(this.ProfileFor.controls['pswd'].status == 'INVALID' || 
    this.ProfileFor.controls['confirm_password'].status == 'INVALID' || 
     !(this.ProfileFor.value.pswd?.length >= 6) ||
    (this.ProfileFor.value.confirm_password != this.ProfileFor.value.pswd)){
      return;
    }
    this.isLoading = true;

    this.sendOtp$ = this.authService.sendMobileOtp(this.phone_number, '+91');

    this.sendOtp$.subscribe((data: any) => {
      this.isOtpSent= true;
      this.isLoading= false;
      this.toastr.success(data.message)
    }, (err)=>{
      this.isLoading= false;
      this.toastr.error("Failed to Send an OTP")
    });
  }

  updatePassword(){
    this.upLoading = true;
    this.otpSubmitted= true;
    this.verifyOtp$ = this.authService.verifyResetOtp(this.phone_number, this.otp);

    this.verifyOtp$.subscribe((data: any) => {
      if(data.resultCode == '1'){
        this.upLoading= false;
        this.toastr.success("Please Wait...")
        this.resetPassword();
      } else{
        this.toastr.error(data.message)
      }

      
    }, (err)=>{
      this.isLoading= false;
      this.toastr.error("Failed to Verify an OTP")
    });
  }
  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = reader.result;
      };
      this.ProfileFor.patchValue({
        profile_image: file
      })

      reader.readAsDataURL(file);
    }
  }
  resetPassword(){
    this.resetPassword$ = this.authService.resetPassword(this.profileData?.email, this.ProfileFor.value.pswd);
    this.resetPassword$.subscribe((data: any) => {

      this.isOtpSent= false;
      this.isSubmitted= false;
      this.ProfileFor.patchValue({
        pswd: '',
        confirm_password: ''
      });
      this.toastr.success("Password has been updated successfully!")
    }, (err:any)=>{
      this.isOtpSent= false;
      this.isSubmitted= false;
      this.ProfileFor.patchValue({
        pswd: '',
        confirm_password: ''
      });
      this.toastr.error("Failed to Update the Password")
    });
  }
}
