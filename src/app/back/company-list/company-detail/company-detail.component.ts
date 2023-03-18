import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  constructor(public planService: PlanService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.planService.cpdetail(this.companyid).subscribe(
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

        this.item = data.results;
        this.admin = data.results.admin;
        this.org = data.results.organization;
      },
      (error) => {
        console.log('Api Err', error);
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
        if (
          data?.resultCode === '0' ||
          data?.resultCode == 4 ||
          data?.resultCode == 0
        ) {
          console.log('Api Data Err', data);
          // this.toastr.error(data.errorMessage);
          return;
        }
        this.deactivateLoading = false;
        this.toastr.success(data.actionPerformed);
      },
      (error) => {
        console.log('Api Err', error);
        this.deactivateLoading = false;
      }
    );
  }
}
