import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';
import { PlanService } from 'src/app/_service/plan.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
})
export class CompanyListComponent {
  expandedIndex = 0;
  items: any;
  listCount: any;
  orgdata: any;

  constructor(
    public planService: PlanService,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    // this.tokenRefresh();
    this.cplist();
    this.cporgcount()
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

  cplist() {
    this.planService.cplist().subscribe(
      (data: any) => {
        if (
          data?.resultCode === '0' ||
          data?.resultCode == 4 ||
          data?.resultCode == 0
        ) {
          console.log('Api Data Err', data);
          this.toastr.error(data.errorMessage);
          return;
        }

        this.items = data.results;
        this.listCount = data.count;
      },
      (error) => {
        console.log('Api Err', error);
      }
    );
  }

  cporgcount() {
    this.planService.cporgcount().subscribe(
      (data: any) => {
        if (
          data?.resultCode === '0' ||
          data?.resultCode == 4 ||
          data?.resultCode == 0
        ) {
          console.log('Api Data Err', data);
          this.toastr.error(data.errorMessage);
          return;
        }

        this.orgdata = data.result;
      },
      (error) => {
        console.log('Api Err', error);
      }
    );
  }

  orgfilter(count:any, start_date:any){

  }
}
