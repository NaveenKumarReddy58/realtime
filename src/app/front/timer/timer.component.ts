import { Component, Input } from '@angular/core';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../_service/auth.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent {
  config: CountdownConfig = { leftTime: 60, format: 'm:s' };
  notify = '';
  isActive = false;

  @Input() username: any;
  @Input() mobileNumber: any;
  @Input() countryCode: any;


  ngOnInit(): void {}

  constructor(public authService: AuthService, private toastr: ToastrService) {}

  handleEvent(e: CountdownEvent) {
    this.isActive = false;

    this.notify = e.action.toUpperCase();
    if (e.action === 'notify') {
      this.notify += ` - ${e.left} ms`;
    }
    if (e.action == 'done') {
      this.isActive = true;
    }
  }

  handleOtp(cd: any) {
    cd.restart();
    this.authService.sendMobileOtp(this.mobileNumber, this.countryCode).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          return;
        }

        this.toastr.success('OTP Sent!');
      },
      (error) => {
        this.authService.dataError(error);
      }
    );
  }
}
