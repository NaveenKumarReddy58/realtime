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
  id: any;
  options: any;
  optionstype: any = 'all';

  todayDate = new Date();

  company$!: Observable<object[]>;
  orgcount$!: Observable<object[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public planService: PlanService,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    // this.id = this.route.snapshot.params['id'];

    this.cplist();
    this.cporgcount();

    this.route.queryParams.subscribe((params) => {
      if (params['plan'] != undefined) {
        this.id = params['plan'];
      }
      console.log('params', this.id, params);
      this.cplist(this.id, params);
    });

    // let options = {
    //   plan: 'tcl',
    //   search_text: 'tcl',
    //   bookmarked: true,
    //   deactivated: true,
    //   start_date: '2023-02-15T17:45:52.990851',
    //   end_date: '2023-02-26T17:45:52.990851',
    // };
  }

  cplist(planid?: number, filter?: any) {
    this.planService.cplist(planid, filter);
    this.company$ = this.planService.get_company();

    this.company$.subscribe((data: any) => {
      this.items = data.results;
      this.listCount = data.count;
    });
  }

  cporgcount() {
    this.planService.cporgcount();
    this.orgcount$ = this.planService.get_orgcount();

    this.orgcount$.subscribe((data: any) => {
      this.orgdata = data.result;
    });
  }

  deactivatedfield() {
    this.optionstype = 'deactivate';
    this.planService.setrouter({ deactivated: true });
  }

  cbookmark(id: Number) {
    this.planService.cbookmark(id).subscribe(
      (data: any) => {
        if (
          data?.resultCode === '0' ||
          data?.resultCode == 4 ||
          data?.resultCode == 0
        ) {
          console.log('Api Data Err', data);
          // this.toastr.error(data.errorMessage);
          return;
        }

        this.cplist();
        this.cporgcount();

        this.router.navigate(['/dashboad']);
        this.toastr.success('Company Bookmarked');
      },
      (error) => {
        console.log('Api Err', error);
      }
    );
  }

  orgfilter(type: any, start_date: any, end_date?: any) {
    // console.log('type', type, this.todayDate);
    this.optionstype = type;
    this.planService.setrouter({ start_date: start_date, end_date: end_date });
  }
}
