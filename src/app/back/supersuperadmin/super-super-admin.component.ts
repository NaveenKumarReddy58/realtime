import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-super-super-admin',
  templateUrl: './super-super-admin.component.html',
  styleUrls: ['./super-super-admin.component.css'],
})
export class SuperSuperAdminComponent {
  ngOnInit(): void {}

  constructor(public authService: AuthService, public router: Router) {
    if (this.authService._isRoleName) {
      this.router.navigate(['/' + this.authService._isRoleName + '/dashboad']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
