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
        this.optionstype = 'all';
      }
      if (params['bookmarked'] != undefined) {
        this.optionstype = 'all';
      }
      if (params['search_text'] != undefined) {
        this.optionstype = 'all';
      }

      if (Object.keys(params).length === 0 && params.constructor === Object) {
        this.cplist();
      } else {
        this.cplist(this.id, params);
      }
    });
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
    this.planService.setrouter({
      deactivated: true,
      plan: null,
      search_text: null,
      bookmarked: null,
      start_date: null,
      end_date: null,
    });
  }

  cbookmark(id: Number) {
    this.planService.cbookmark(id).subscribe(
      (data: any) => {
        this.authService.resultCodeError(data);

        this.cplist();
        this.cporgcount();

        this.router.navigate(['/dashboad']);
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
      this.planService.setrouter({
        start_date: null,
        end_date: null,
        plan: null,
        search_text: null,
        bookmarked: null,
        deactivated: null,
      });
    } else {
      this.planService.setrouter({
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
