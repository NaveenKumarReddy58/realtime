import { Component, Input } from '@angular/core';
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
  _isRoleName: any = '0';

  @Input() isRoleIn: any;

  ngOnInit(): void {}

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.timer = setInterval(() => {
      this.authService.tokenRefresh();
    }, 290000);

    this._isRoleName = this.authService._isRoleName;
  }

  doLogout() {
    this.authService.doLogout();
    this.toastr.success('Logout!');
  }
}
