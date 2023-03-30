import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';
import { PlanService } from 'src/app/_service/plan.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
})
export class CompanyDetailComponent {
  @Input() companyid: any;
  item: any;
  admin: any;
  org: any;
  deactivateLoading: any;
  org_status: string = 'true';
  cpreason: string = '';
  cpreasonData: any;

  constructor(
    public planService: PlanService,
    public authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.planService.cpdetail(this.companyid).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          return;
        }

        this.item = data.results;
        this.admin = data.results.admin;
        this.org = data.results.organization;
      },
      (error) => {
        this.authService.dataError(error);
      }
    );
  }

  cpdeactivate(id: Number) {
    if (this.cpreason == '') {
      this.cpreasonData = true;
      this.deactivateLoading = false;
      return;
    } else {
      this.cpreasonData = false;
    }

    this.deactivateLoading = true;
    this.planService.cpdeactivate(id, this.org_status).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          return;
        }

        this.deactivateLoading = false;
        this.toastr.success(data?.actionPerformed);
      },
      (error) => {
        this.authService.dataError(error);
        this.deactivateLoading = false;
      }
    );
  }
}
