import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';
import { DriverService } from 'src/app/_service/driver.service';
import { PlanService } from 'src/app/_service/plan.service';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css'],
})
export class DriverListComponent {
  expandedIndex = 0;
  items: any;

  loading = false;
  delloading = false;
  toggle: any = [];

  driver$!: Observable<object[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public planService: PlanService,
    public authService: AuthService,
    public driverService: DriverService,
    private toastr: ToastrService
  ) {
    this.driverList();
  }
  ngOnInit(): void {}

  driverList(id?: number) {
    this.driverService.driverList(id);
    this.driver$ = this.driverService.getDrivers();

    this.driver$.subscribe((data: any) => {
      this.items = data.results;
    });
  }

  driverActivateDeactivate(id: Number, status: any) {
    this.loading = true;
    this.driverService.driverActivateDeactivate(id, status).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.loading = false;
          return;
        }

        this.driverList();
        this.router.navigate(['/admin/driver']);
        this.toastr.success('Warehouse Status Updated');
      },
      (error) => {
        this.authService.dataError(error);
        this.loading = false;
      }
    );
  }

  driverDelete(id: any) {
    this.toggle[id] = true;
    this.delloading = true;
    this.driverService.driverDelete(id).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.delloading = false;
          return;
        }

        this.driverList();
        this.router.navigate(['/admin/driver']);
        this.toastr.success('Driver Deleted');
        this.delloading = false;
      },
      (error) => {
        this.authService.dataError(error);
        this.delloading = false;
      }
    );
  }
}
