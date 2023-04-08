import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';
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

  plans$!: Observable<object[]>;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public planService: PlanService,
    public authService: AuthService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.planList();
  }

  ngOnInit(): void {}

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

  planList() {
    this.planService.planList();
    this.plans$ = this.planService.getPlans();

    this.plans$.subscribe((data: any) => {
      this.items = data.results;
      this.listCount = data.count;
    });
  }

  planDelete(id: Number) {
    this.delloading = true;
    this.planService.planDelete(id).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          return;
        }

        this.planList();
        this.router.navigate(['/' + this.authService._isRoleName + '/plans']);
        this.toastr.success('Plan Deleted');
      },
      (error) => {
        this.authService.dataError(error);
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
