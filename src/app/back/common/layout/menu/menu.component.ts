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

  ngOnInit(): void { }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    // this.timer = setInterval(() => {
    //   this.authService.tokenRefresh();
    // }, 500000);

    this._isRoleName = this.authService._isRoleName;
  }

  doLogout() {
    this.authService.doLogout();
    this.toastr.success('Logout!');
  }
  hideSidebar() {
    // this.isShowMenu= !this.isShowMenu;
    let val: any = 'none';
    const element: any = document.getElementById('sideBar');
    element.style.display = val;

    let width: any = '100%';
    let padding:any="0px 12px";
    let right:any="0px";

    const element2: any = document.getElementById('mainContentContainer');
    element2.style.width = width;
    element2.style.padding = padding;
    element2.style.right = right;

    let display: any = 'flex';

    const element3: any = document.getElementById('show-menu-bar');
    element3.style.display = display;

    const element4: any = document.getElementById('topBarLinks');
    element4.classList.remove('col-lg-8');
    element4.classList.add('col-lg-7');

  }
}
