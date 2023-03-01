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

  constructor(public planService: PlanService, private toastr: ToastrService) {}
  ngOnInit(): void {
    this.cpdetail(this.companyid);
  }

  cpdetail(companyid: any) {
    this.planService.cpdetail(companyid).subscribe(
      (data: any) => {
        if (data?.resultCode == 4) {
          console.log('Api Data Err', data);
          this.toastr.error('', data.errorMessage);
          return;
        }

        this.item = data.results;
      },
      (data) => {
        console.log('Api Err', data);
      }
    );
  }
}
