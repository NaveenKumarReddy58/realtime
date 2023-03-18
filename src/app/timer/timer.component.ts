import { Component, Input } from '@angular/core';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_service/auth.service';

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

  constructor(public authService: AuthService, private toastr: ToastrService) {}

  handleEvent(e: CountdownEvent) {
    this.isActive = false;

    this.notify = e.action.toUpperCase();
    if (e.action === 'notify') {
      this.notify += ` - ${e.left} ms`;
    }
    // console.log('Notify', e, e.action, this.username);
    if (e.action == 'done') {
      this.isActive = true;
      console.log('Notify', e, e.action, this.username);
    }
  }

  handleOtp(cd: any) {
    cd.restart();
    this.authService.sendMobileOtp(this.username).subscribe(
      (data: any) => {
        if (
          data?.resultCode === '0' ||
          data?.resultCode == 4 ||
          data?.resultCode == 0
        ) {
          console.log('Api Data Err', data);
          // this.toastr.error(data.message);
          return;
        }

        this.toastr.success('OTP Sent!');
      },
      (error) => {
        console.log('Api Err', error);
      }
    );
  }
}
