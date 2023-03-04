import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';
import { PlanService } from 'src/app/_service/plan.service';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css'],
})
export class TopComponent {
  plandata: any;
  searchbox = false;

  constructor(
    public planService: PlanService,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.plancount();
  }

  plancount() {
    this.planService.plancount().subscribe(
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

        this.plandata = data.result;
      },
      (error) => {
        console.log('Api Err', error);
      }
    );
  }

  searchboxopen() {
    this.searchbox = !this.searchbox;
  }
}
