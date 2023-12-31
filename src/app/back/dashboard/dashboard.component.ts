import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  isLoggedIn: any = false;
  isRoleIn: any = false;

  ngOnInit(): void {}

  constructor(public authService: AuthService, public router: Router) {
    this.authService.getDashboard().subscribe((data: any) => {
      this.isLoggedIn = data;
    });

    this.authService.getRole().subscribe((data: any) => {
      if (data != false) {
        this.isRoleIn = data[0];
      } else {
        this.isRoleIn = data;
      }
    });
  }
}
