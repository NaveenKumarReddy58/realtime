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
  phoneNumber = '7528943768';
  otpSubmitted: boolean= false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.ProfileFor = formBuilder.group({
      pswd: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    });

    console.log(this.ProfileFor)

    this.getProfile();
  }
  ngOnInit(): void {
    console.log(this.ProfileFor)
  }

  getProfile() {
    this.profile$ = this.authService.getProfile();

    this.profile$.subscribe((data: any) => {
      this.profileData = data?.result;
    });
  }

  onOtpChange(otp: any){
    this.otp= otp;
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

    this.sendOtp$ = this.authService.sendMobileOtp(this.phoneNumber, '+91');

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
    this.verifyOtp$ = this.authService.verifyResetOtp(this.phoneNumber, this.otp);

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
