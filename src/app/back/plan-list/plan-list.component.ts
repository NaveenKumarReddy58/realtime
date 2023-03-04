import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PlanService } from 'src/app/_service/plan.service';
import { DialogAnimationsComponent } from './dialog-animations/dialog-animations.component';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css'],
})
export class PlanListComponent {
  expandedIndex = 0;
  loading = false;
  delloading = false;
  items: any;
  listCount: any;
  toggle: number[] = [];
  isView: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public planService: PlanService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.plist();
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(DialogAnimationsComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  plist() {
    this.planService.plist().subscribe(
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
        this.loading = false;
      }
    );
  }

  pdelete(id: Number) {
    this.delloading = true;
    this.planService.pdelete(id).subscribe(
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

        this.plist();
        this.router.navigate(['/plans']);
        this.toastr.success(data.actionPerformed);
      },
      (error) => {
        console.log('Api Err', error);
        this.delloading = false;
      }
    );
  }

  boxClose(index: any) {
    this.toggle[index] = 0;
  }

  kmClose(index: any) {
    this.isView[index] = 0;
  }
}
