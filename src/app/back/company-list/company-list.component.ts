import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
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
  id: Number;

  company$!: Observable<object[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public planService: PlanService,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.id = this.route.snapshot.params['id'];

    this.cplist();
    this.cporgcount();

    if (this.id) {
      this.cplist(this.route.snapshot.params['id']);
    }

    this.route.queryParams.subscribe((params) => {
      console.log('params', this.route.snapshot.params['id'], params);
      this.cplist(this.route.snapshot.params['id'], params);
    });

    // let options = {
    //   search_text: 'tcl',
    //   bookmarked: false,
    //   deactivated: false,
    //   start_date: '2023-02-15T17:45:52.990851',
    //   end_date: '2023-02-26T17:45:52.990851',
    // };
  }

  cplist(planid?: number, filter?: any) {
    this.planService.cplist(planid, filter);
    this.company$ = this.planService.get_company();

    this.company$.subscribe((data: any) => {
      console.log('this.company$', data);
      this.items = data.results;
      this.listCount = data.count;
    });
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

  orgfilter(count: any, start_date: any) {}
}
