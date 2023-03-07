import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  timer: any = 0;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.timer = setInterval(() => {
      // this.tokenRefresh();
    }, 290000);
  }

  tokenRefresh() {
    this.authService.tokenRefresh().subscribe(
      (data: any) => {
        if (
          data?.resultCode === '0' ||
          data?.resultCode == 4 ||
          data?.resultCode == 0
        ) {
          console.log('Api Data Err', data);
          return;
        }
        console.log('tokenRefresh');
      },
      (error) => {
        console.log('Api Err', error);
      }
    );
  }

  doLogout() {
    this.authService.doLogout();
    this.toastr.success('Logout!');
  }
}
