import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PlanService } from 'src/app/_service/plan.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
})
export class CompanyListComponent {
  // items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;
  loading = false;
  items: any;
  listCount: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public planService: PlanService,
    private toastr: ToastrService
  ) {
    this.cplist();
  }

  cplist() {
    this.planService.cplist().subscribe(
      (data: any) => {
        console.log('Api Data Err', data);
        if (data?.resultCode == 4) {
          console.log('Api Data Err', data);
          this.toastr.error('', data.errorMessage);
          return;
        }

        this.items = data.results;
        this.listCount = data.count;

        console.log('data', data);
        this.toastr.success('Success', data.actionPerformed);
      },
      (data) => {
        this.loading = false;
        console.log('Api Err', data);
      }
    );
  }
}
