import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PlanService } from 'src/app/_service/plan.service';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css']
})
export class PlanListComponent {
  expandedIndex = 0;
  loading = false;
  items: any;
  listCount: any;
  toggle: number[] = []

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public planService: PlanService,
    private toastr: ToastrService
  ) {
    this.list();
  }

  list() {
    this.planService.list().subscribe(
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

  deleteAction(id: Number) {
    this.planService.delete(id).subscribe(
      (data: any) => {
        console.log('Api Data Err', data);
        if (data?.resultCode == 4) {
          console.log('Api Data Err', data);
          this.toastr.error('', data.errorMessage);
          return;
        }

        this.list();
        this.router.navigate(['/plans']);

        console.log('data', data);
        this.toastr.success('Success', data.actionPerformed);
      },
      (data) => {
        this.loading = false;
        console.log('Api Err', data);
      }
    );
  }

  clickEvent(index: any) {
    this.toggle[index] = 0;
  }
}
