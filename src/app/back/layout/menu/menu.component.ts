import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  timer: any = 0

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.timer = setInterval(() => {
      this.authService.tokenRefresh().subscribe(
        (data: any) => {
          if (data?.resultCode == 4) {
            console.log('Api Data Err', data);
            return;
          }

          console.log('Api tokenRefresh');
        },
        (data) => {
          console.log('Api Err', data);
        }
      );
      console.log('tokenRefresh');
    }, 290000);
  }

  doLogout() {
    this.authService.doLogout();
    this.toastr.success('', 'logout!');
  }
}
