import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AuthService } from 'src/app/_service/auth.service';
import { CompanyListComponent } from '../supersuperadmin/company-list/company-list.component';
import { OrderListComponent } from '../superadmin/order-list/order-list.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, CompanyListComponent, OrderListComponent],
})
export class DashboardComponent {
  isLoggedIn: any = false;
  isRoleIn: any = false;

  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    public authService: AuthService,
    public router: Router
  ) {
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
