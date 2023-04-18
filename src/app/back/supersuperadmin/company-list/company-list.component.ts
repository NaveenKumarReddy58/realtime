import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';
import { CompanyService } from 'src/app/_service/company.service';
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
  orgCount$!: Observable<object[]>;

  ngOnInit(): void {}

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public planService: PlanService,
    public authService: AuthService,
    public companyService: CompanyService,
    private toastr: ToastrService
  ) {
    // this.id = this.route.snapshot.params['id'];

    this.companyList(0);
    this.orgCount();

    this.route.queryParams.subscribe((params) => {
      if (params['plan'] != undefined) {
        this.id = params['plan'];
      } else {
        this.id = 0;
      }

      if (
        params['plan'] != undefined ||
        params['bookmarked'] != undefined ||
        params['search_text'] != undefined
      ) {
        this.optionstype = 'all';
      }

      if (Object.keys(params).length === 0 && params.constructor === Object) {
        this.companyList(0);
      } else {
        this.companyList(this.id, params);
      }
    });
  }

  companyList(planid?: number, filter?: any) {
    this.companyService.companyList(planid, filter);
    this.company$ = this.companyService.getCompany();

    this.company$.subscribe((data: any) => {
      this.items = data?.results;
      this.listCount = data?.count;
    });
  }

  orgCount() {
    this.companyService.orgCount();
    this.orgCount$ = this.companyService.getOrgCount();

    this.orgCount$.subscribe((data: any) => {
      this.orgdata = data?.result;
    });
  }

  deactivatedfield() {
    this.optionstype = 'deactivate';
    this.authService.setRouter({
      deactivated: true,
      plan: null,
      search_text: null,
      bookmarked: null,
      start_date: null,
      end_date: null,
    });
  }

  companyBookmark(id: Number) {
    this.companyService.companyBookmark(id).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          return;
        }

        this.companyList();
        this.orgCount();

        this.router.navigate([
          '/' + this.authService._isRoleName + '/dashboard',
        ]);
        this.toastr.success('Company Bookmarked');
      },
      (error) => {
        this.authService.dataError(error);
      }
    );
  }

  orgfilter(type: any, start_date: any, end_date?: any) {
    this.optionstype = type;

    if (this.optionstype == 'all') {
      this.authService.setRouter({
        start_date: null,
        end_date: null,
        plan: null,
        search_text: null,
        bookmarked: null,
        deactivated: null,
      });
    } else {
      this.authService.setRouter({
        start_date: start_date,
        end_date: end_date,
        plan: null,
        search_text: null,
        bookmarked: null,
        deactivated: null,
      });
    }
  }

  setCount(count: any) {
    if (count > 0) {
      return count - 1;
    } else {
      return count;
    }
  }
}
